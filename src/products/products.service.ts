import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly ProductsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly ProductImagesRepository: Repository<ProductImage>,
    private readonly DataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.ProductsRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.ProductImagesRepository.create({ url: image }),
        ),
      });
      await this.ProductsRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.ProductsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });

    return products.map(({ images, ...product }) => ({
      ...product,
      images: images?.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product | null = null;

    if (isUUID(term)) {
      // product = await this.ProductsRepository.findOne({ where: { id: term }, relations: { images: true } });
      product = await this.ProductsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.ProductsRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title OR slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product)
      throw new BadRequestException(
        `Product with id or slug "${term}" not found`,
      );

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return { ...product, images: images?.map((img) => img.url) };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.ProductsRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id "${id}" not found`);

    // Create Query Runner
    const queryRunner = this.DataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.ProductImagesRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

      // await this.ProductsRepository.save(product);
      // return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.ProductsRepository.remove(product);
    return { message: `Product with id ${id} has been removed` };
  }

  private handleDBExceptions(error: any) {
    const err = error as { code?: string; detail?: string; message?: string };

    if (err.code === '23505')
      throw new BadRequestException(err.detail ?? err.message);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async deleteAllProducts() {
    const query = this.ProductsRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
