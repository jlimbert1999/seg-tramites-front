import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { publication } from '../../infrastructure/interfaces/publications.interface';

interface attachmentProps {
  title: string;
  filename: string;
}

interface updatePublicationProps {
  id: string;
  form: Object;
  attachments: attachmentProps[];
  image?: string;
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

  create(
    form: Object,
    attachments: attachmentProps[],
    image: attachmentProps | null
  ) {
    return this.http.post<publication>(this.url, {
      ...form,
      image: image?.filename,
      attachments,
    });
  }

  updated({ id, attachments, image, form }: updatePublicationProps) {
    return this.http.patch<publication>(`${this.url}/${id}`, {
      ...form,
      image,
      attachments,
    });
  }

  delete(id: string) {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

  findAll(limit: number = 10, offset: number = 0) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<publication[]>(this.url, { params });
  }

  findByUser() {
    const params = new HttpParams({ fromObject: { limit: 10, offset: 0 } });
    return this.http.get<{ publications: publication[]; length: number }>(
      `${this.url}/user`,
      { params }
    );
  }

  getNews(limit: number = 10, offset: number = 0) {
    const params = new HttpParams({
      fromObject: { limit: limit, offset: offset },
    });
    return this.http.get<publication[]>(`${this.url}/news`, { params });
  }

  getFile(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }
}
