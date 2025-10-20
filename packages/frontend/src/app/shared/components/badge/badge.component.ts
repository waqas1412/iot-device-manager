import { Component, Input, signal, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
export type BadgeSize = 'sm' | 'default' | 'lg';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 9999px;
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    /* Variants */
    .badge-default {
      background: var(--gradient-primary);
      color: hsl(var(--primary-foreground));
      box-shadow: var(--shadow-sm);
    }

    .badge-secondary {
      background: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
    }

    .badge-destructive {
      background: hsl(var(--destructive));
      color: hsl(var(--destructive-foreground));
    }

    .badge-outline {
      border: 1px solid hsl(var(--border));
      background: transparent;
      color: hsl(var(--foreground));
    }

    .badge-success {
      background: hsl(142.1 76.2% 36.3%);
      color: hsl(355.7 100% 97.3%);
    }

    .badge-warning {
      background: hsl(38 92% 50%);
      color: hsl(48 96% 89%);
    }

    /* Sizes */
    .badge-sm {
      height: 1.25rem;
      padding: 0 0.5rem;
      font-size: 0.75rem;
    }

    .badge-default-size {
      height: 1.5rem;
      padding: 0 0.75rem;
      font-size: 0.75rem;
    }

    .badge-lg {
      height: 1.75rem;
      padding: 0 1rem;
      font-size: 0.875rem;
    }

    /* Animations */
    .badge-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .badge-glow {
      box-shadow: var(--glow-primary);
    }

    .badge-floating {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-2px);
      }
    }

    /* Shimmer effect */
    .badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .badge:hover::before {
      left: 100%;
    }
  `]
})
export class BadgeComponent implements OnInit, OnChanges {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'default';
  @Input() pulse = false;
  @Input() glow = false;
  @Input() floating = false;

  badgeClasses = 'badge';

  ngOnInit() {
    this.updateClasses();
  }

  ngOnChanges() {
    this.updateClasses();
  }

  private updateClasses() {
    let classes = 'badge';
    
    // Variant
    if (this.variant === 'default') {
      classes += ' badge-default';
    } else {
      classes += ` badge-${this.variant}`;
    }
    
    // Size
    if (this.size === 'default') {
      classes += ' badge-default-size';
    } else {
      classes += ` badge-${this.size}`;
    }
    
    // Effects
    if (this.pulse) classes += ' badge-pulse';
    if (this.glow) classes += ' badge-glow';
    if (this.floating) classes += ' badge-floating';
    
    this.badgeClasses = classes;
  }
}
