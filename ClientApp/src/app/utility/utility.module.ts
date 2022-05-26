import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    ImageCarouselComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports:[
    ImageCarouselComponent
  ]
})
export class UtilityModule { }
