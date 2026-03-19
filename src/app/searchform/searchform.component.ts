import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  SearchservicesService,
  filmData,
  responseData,
} from '../services/searchservices.service';

@Component({
  selector: 'app-searchform',
  standalone: false,
  templateUrl: './searchform.component.html',
  styleUrl: './searchform.component.scss',
})
export class SearchformComponent {
  inputStates = new FormControl('');
  chars: filmData[] = [];
  nextPage: string = '';
  previousPage: string = '';
  isLoading: boolean = false;

  constructor(private searchService: SearchservicesService) {}

  search(event: Event) {
    event.preventDefault();
    const charName = this.inputStates?.value?.trim();
    if (charName) {
      this.isLoading = true;
      this.searchService
        .searchWithCharName(charName)
        .subscribe((data: responseData) => {
          this.isLoading = false;
          this.chars = data.results;
          this.nextPage = data.next;
          this.previousPage = data.previous;
        });
    }
    return;
  }

  onPageChange(url: string) {
    this.isLoading = true;
    this.searchService
      .searchWithPageNumberURL(url)
      .subscribe((data: responseData) => {
        this.isLoading = false;
        this.chars = data.results;
        this.nextPage = data.next;
        this.previousPage = data.previous;
      });
  }
}
