import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs/index';
import { trigger, state, style, animate, transition, sequence, keyframes } from '@angular/animations';
@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css'],
  animations: [
    trigger('fade',[

    transition('*=>*', [ sequence([
        animate('2.5s 2.5s', style({ opacity: 0})),animate("2.5s", style({opacity: 1}))])
        ])
      ])
    ]
})
export class ImageCarouselComponent implements OnInit {

  imageSources: string[] = ["src1.jpg", "src2.jpg", "src3.jpg", "src4.gif"];
  currentIndex: number = 0;
  constructor() { }

  ngOnInit(): void {
    var timer = interval(5000);
    timer.subscribe(value => this.switchImage());
  }

  switchImage(): void{
    this.currentIndex++;
    
    
    if(this.currentIndex >= this.imageSources.length || this.currentIndex < 0)
    {
      this.currentIndex = 0;
    }
  }

}
