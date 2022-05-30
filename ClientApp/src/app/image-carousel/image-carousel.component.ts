import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { trigger, state, style, animate, transition, sequence, keyframes } from '@angular/animations';
@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css'],
  animations: [
    trigger('fade',[

      transition('*=>*', [ 
          animate('0.5s 2.5s', style({ opacity: 0})),
          ]),
        ])
      ]
})
export class ImageCarouselComponent implements OnInit {

  imageSources: string[] = ["src1.jpg", "src2.jpg", "src3.jpg", "src4.gif"];
  currentIndex: number = 0;
  constructor() { }

  ngOnInit(): void {
    var timer = interval(3000);
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
