import { ApiProperty } from "@nestjs/swagger";


export class EmailResponseDto {
    @ApiProperty({ example: 'clx123456789'})
    id: string;

    @ApiProperty({ example: 'queued', enum: ['queued', 'sent', 'failed']})
    status: 'queued' | 'sent' | 'failed';
}