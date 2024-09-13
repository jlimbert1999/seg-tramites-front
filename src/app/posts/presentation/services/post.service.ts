import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { publications } from '../../infrastructure/interfaces/publications.interface';

interface attachmentProps {
  title: string;
  filename: string;
}
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly url = `${environment.base_url}/posts`;
  private http = inject(HttpClient);
  constructor() {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<attachmentProps>(
      `${environment.base_url}/files/post`,
      formData
    );
  }

  create(form: Object, attachments: attachmentProps[]) {
    return this.http.post(this.url, { ...form, attachments });
  }

  findAll() {
    const params = new HttpParams({ fromObject: { limit: 10, offset: 0 } });
    return this.http.get<publications[]>(this.url, { params });
  }
}
