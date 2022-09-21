import { Inject, Injectable } from '@angular/core';
import { UtilityModule } from '../utility/utility.module';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private linkArray: number[] = [];
  private numberPages: number = 0;
  private totalItems: number = 0;
  private maxLinks: number = 0;
  constructor() {}

  init(maxLinks: number, itemsPerPage: number, totalItems: number): void{
      this.maxLinks = maxLinks;
      this.totalItems = totalItems;
      this.numberPages = Math.trunc(this.totalItems / itemsPerPage) + 1;
      this.linkArray = [].constructor(this.numberPages <= this.maxLinks ? this.numberPages : this.maxLinks);
  }

  getNumberPages(): number{
    return this.numberPages;
  }

  getTotalItems(): number{
    return this.totalItems;
  }

  getCurrentLinkArray(): number[]{
    return this.linkArray;
  }

  updateLinkArray(pageNumber: number): number[]{

    console.log(this.maxLinks + " " + this.totalItems);

    if(this.numberPages <= this.maxLinks){
      this.linkArray = [...Array(this.linkArray.length).keys()].map(x => ++x);
    }
    else{
      let half = Math.trunc(this.maxLinks/2);

      let currentIndex = 0;
      for(let i = -half; currentIndex < this.linkArray.length; i++)
      {
      
        console.log(i);
        let numberForIndex = pageNumber + i;
        if( numberForIndex <= 0)
        {
          numberForIndex = this.linkArray.length + i + 1;
        } else

        if( numberForIndex > this.numberPages){
          numberForIndex -= this.linkArray.length;
        }

        this.linkArray[currentIndex] = numberForIndex;
        currentIndex++;
      }

      this.linkArray.sort((a: number,b: number) => {
        if(a < b)
          return -1;
        if(a > b)
          return 1;
        return 0;
      });
    }
    console.log(this.linkArray);

    return this.linkArray;
  }
}
