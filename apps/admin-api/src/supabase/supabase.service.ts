import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_KEY'),
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucketName = 'assets'; // Adjust this to the correct bucket if necessary

    // Generate a unique hash for the file name
    const uniqueToken = generateAlphanumericToken(24);
    const fileExtension = file.originalname.split('.').pop(); // Get the file extension
    const filePath = `public/${uniqueToken}.${fileExtension}`; // Create a file path using the token and extension

    const { error } = await this.supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get the public URL of the uploaded file
    try {
      const response = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return response.data.publicUrl;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get public URL');
    }
  }

  async deleteFile(fileUrl: string) {
    const fileName = fileUrl.split('/').pop();
    const { error } = await this.supabase.storage
      .from('assets')
      .remove([fileName]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }

    return true;
  }
}

function generateAlphanumericToken(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
