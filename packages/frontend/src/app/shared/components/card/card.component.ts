import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      background: hsl(var(--card));
      color: hsl(var(--card-foreground));
      border-radius: var(--radius);
      border: 1px solid hsl(var(--border));
      box-shadow: var(--shadow-sm);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--gradient-primary);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
      border-color: hsl(var(--primary) / 0.3);
    }

    .card:hover::before {
      opacity: 1;
    }

    .card-interactive {
      cursor: pointer;
    }

    .card-interactive:hover {
      box-shadow: var(--shadow-xl), var(--glow-primary);
    }

    .card-glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card-gradient {
      background: var(--gradient-secondary);
      border: 1px solid hsl(var(--primary) / 0.2);
    }

    .card-glow {
      box-shadow: var(--shadow-lg), var(--glow-primary);
    }

    .card-floating {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-5px);
      }
    }
  `]
})
export class CardComponent implements OnInit, OnChanges {
  @Input() interactive = false;
  @Input() glass = false;
  @Input() gradient = false;
  @Input() glow = false;
  @Input() floating = false;

  cardClasses = 'card';

  ngOnInit() {
    this.updateClasses();
  }

  ngOnChanges() {
    this.updateClasses();
  }

  private updateClasses() {
    let classes = 'card';
    
    if (this.interactive) classes += ' card-interactive';
    if (this.glass) classes += ' card-glass';
    if (this.gradient) classes += ' card-gradient';
    if (this.glow) classes += ' card-glow';
    if (this.floating) classes += ' card-floating';
    
    this.cardClasses = classes;
  }
}
