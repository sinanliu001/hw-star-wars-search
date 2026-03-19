import { Injectable } from '@angular/core';
import { forkJoin, map, switchMap, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface starWarChar {
  name: string;
  films: string[];
}

export interface filmData {
  name: string;
  filmData: {
    title: string;
    created: string;
  }[];
}

export interface responseData {
  next: string;
  previous: string;
  results: filmData[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchservicesService {
  constructor(private http: HttpClient) {}

  fetchData(url: string) {
    return this.http.get(url).pipe(
      switchMap((data: any) => {
        const detailCalls = data?.results?.map((char: starWarChar) => {
          const filmsData = char.films.map((url) => this.http.get(url));
          return forkJoin(filmsData).pipe(
            map((value) => {
              return {
                name: char.name,
                filmData: value,
              };
            }),
          );
        });
        return data?.results?.length
          ? forkJoin(detailCalls).pipe(
              map(
                (finalData): responseData => ({
                  next: data.next,
                  previous: data.previous,
                  results: finalData as filmData[],
                }),
              ),
            )
          : of({
              next: '',
              previous: '',
              results: [],
            });
      }),
    );
  }

  searchWithCharName(characterName: string) {
    const url = `https://swapi.dev/api/people/?search=${characterName}`;
    return this.fetchData(url);
  }

  searchWithPageNumberURL(url: string) {
    return this.fetchData(url);
  }
}
