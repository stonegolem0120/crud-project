import { Injectable } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { ReadStream } from 'fs';

@Injectable()
export class CassandraService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      contactPoints: ['127.0.0.1'], // Cassandra 호스트 주소
      localDataCenter: 'datacenter1',
      keyspace: 'my_keyspace',
    });
  }

  async getAllData(): Promise<any[]> {
    const query = 'SELECT * FROM my_table WHERE is_deleted = false';
    const result = await this.client.execute(query);
    return result.rows;
  }

  async createData(data: any): Promise<any> {
    const currentTime = new Date().toISOString();
    const query =
      'INSERT INTO my_table (column1, column2, is_deleted, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
    const params = [
      data.column1,
      data.column2,
      false,
      currentTime,
      currentTime,
    ];
    return this.client.execute(query, params, { prepare: true });
  }

  async updateData(data: any): Promise<any> {
    const currentTime = new Date().toISOString();
    const query =
      'UPDATE my_table SET column1 = ?, column2 = ?, updated_at = ? WHERE id = ?';
    const params = [data.column1, data.column2, currentTime, data.id];
    return this.client.execute(query, params, { prepare: true });
  }

  async softDeleteData(id: string): Promise<any> {
    const currentTime = new Date().toISOString();
    const query =
      'UPDATE my_table SET is_deleted = true, deleted_at = ?, updated_at = ? WHERE id = ?';
    const params = [currentTime, currentTime, id];
    return this.client.execute(query, params, { prepare: true });
  }

  async saveFile(
    fileId: string,
    fileStream: ReadStream,
    filename: string,
    mimetype: string,
    encoding: string,
  ): Promise<void> {
    const query =
      'INSERT INTO files (file_id, file_data, file_name, mimetype, encoding, upload_time) VALUES (?, ?, ?, ?, ?, ?)';
    const uploadTime = new Date();

    // 파일 스트림을 Cassandra 저장에 적합한 형식으로 변환합니다.
    // 예를 들어, 스트림을 버퍼로 읽어올 수 있습니다.
    const buffer = await this.streamToBuffer(fileStream);

    // CQL 쿼리를 실행합니다.
    await this.client.execute(
      query,
      [fileId, buffer, filename, mimetype, encoding, uploadTime],
      { prepare: true },
    );
  }

  private streamToBuffer(stream: ReadStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (error) => reject(error));
    });
  }
}
