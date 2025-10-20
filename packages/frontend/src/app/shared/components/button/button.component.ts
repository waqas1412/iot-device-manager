import { Component, Input, Output, EventEmitter, signal, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      type="button"
    >
      @if (loading) {
        <div class="spinner"></div>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: var(--radius);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border: none;
      outline: none;
    }

    button:focus-visible {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }

    button:disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    /* Variants */
    .btn-default {
      background: var(--gradient-primary);
      color: hsl(var(--primary-foreground));
      box-shadow: var(--shadow-sm);
    }

    .btn-default:hover:not(:disabled) {
      box-shadow: var(--shadow-md), var(--glow-primary);
      transform: translateY(-1px);
    }

    .btn-destructive {
      background: hsl(var(--destructive));
      color: hsl(var(--destructive-foreground));
      box-shadow: var(--shadow-sm);
    }

    .btn-destructive:hover:not(:disabled) {
      background: hsl(var(--destructive) / 0.9);
      box-shadow: var(--shadow-md), var(--glow-danger);
      transform: translateY(-1px);
    }

    .btn-outline {
      border: 1px solid hsl(var(--border));
      background: transparent;
      color: hsl(var(--foreground));
    }

    .btn-outline:hover:not(:disabled) {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
      box-shadow: var(--shadow-sm);
    }

    .btn-secondary {
      background: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
      box-shadow: var(--shadow-sm);
    }

    .btn-secondary:hover:not(:disabled) {
      background: hsl(var(--secondary) / 0.8);
      box-shadow: var(--shadow-md);
    }

    .btn-ghost {
      background: transparent;
      color: hsl(var(--foreground));
    }

    .btn-ghost:hover:not(:disabled) {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }

    .btn-link {
      background: transparent;
      color: hsl(var(--primary));
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    .btn-link:hover:not(:disabled) {
      color: hsl(var(--primary) / 0.8);
    }

    /* Sizes */
    .btn-sm {
      height: 2rem;
      padding: 0 0.75rem;
      font-size: 0.75rem;
    }

    .btn-default-size {
      height: 2.5rem;
      padding: 0 1rem;
    }

    .btn-lg {
      height: 2.75rem;
      padding: 0 2rem;
      font-size: 1rem;
    }

    .btn-icon {
      height: 2.5rem;
      width: 2.5rem;
      padding: 0;
    }

    /* Spinner */
    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Shimmer effect */
    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    button:hover::before {
      left: 100%;
    }
  `]
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'default';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Output() onClick = new EventEmitter<Event>();

  buttonClasses = '';

  ngOnInit() {
    this.updateClasses();
  }

  ngOnChanges() {
    this.updateClasses();
  }

  private updateClasses() {
    const variantClass = `btn-${this.variant}`;
    const sizeClass = this.size === 'default' ? 'btn-default-size' : `btn-${this.size}`;
    this.buttonClasses = `${variantClass} ${sizeClass}`;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
