import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // Transformar
  @Type(() => Number)
  readonly limit?: number;

  @IsOptional()
  @Min(0)
  // Transformar
  @Type(() => Number)
  readonly offset?: number;
}
