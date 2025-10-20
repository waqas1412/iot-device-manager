import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-container">
      @if (label) {
        <label [for]="inputId" class="input-label">{{ label }}</label>
      }
      <div class="input-wrapper">
        @if (icon) {
          <div class="input-icon">
            <ng-content select="[slot=icon]"></ng-content>
          </div>
        }
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          class="input-field"
          [class.input-error]="error"
        />
        @if (error) {
          <div class="input-error-icon">⚠</div>
        }
      </div>
      @if (error) {
        <div class="input-error-message">{{ error }}</div>
      }
      @if (hint && !error) {
        <div class="input-hint">{{ hint }}</div>
      }
    </div>
  `,
  styles: [`
    .input-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(var(--foreground));
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-field {
      width: 100%;
      height: 2.5rem;
      padding: 0.5rem 0.75rem;
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      color: hsl(var(--foreground));
      font-size: 0.875rem;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }

    .input-field::placeholder {
      color: hsl(var(--muted-foreground));
    }

    .input-field:focus {
      border-color: hsl(var(--ring));
      box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
    }

    .input-field:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input-field.input-error {
      border-color: hsl(var(--destructive));
    }

    .input-field.input-error:focus {
      box-shadow: 0 0 0 2px hsl(var(--destructive) / 0.2);
    }

    .input-icon {
      position: absolute;
      left: 0.75rem;
      color: hsl(var(--muted-foreground));
      z-index: 1;
    }

    .input-field:has(+ .input-icon) {
      padding-left: 2.5rem;
    }

    .input-error-icon {
      position: absolute;
      right: 0.75rem;
      color: hsl(var(--destructive));
      font-size: 0.875rem;
    }

    .input-error-message {
      font-size: 0.75rem;
      color: hsl(var(--destructive));
    }

    .input-hint {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
    }

    /* Futuristic glow effect */
    .input-field:focus {
      box-shadow: 
        0 0 0 2px hsl(var(--ring) / 0.2),
        0 0 20px hsl(var(--ring) / 0.1);
    }

    /* Animated border */
    .input-field {
      position: relative;
    }

    .input-field::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 1px;
      background: var(--gradient-primary);
      border-radius: inherit;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
      -webkit-mask-composite: xor;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .input-field:focus::before {
      opacity: 1;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() icon = false;
  @Input() disabled: boolean = false;
  @Input() error: string | null = null;
  @Output() valueChange = new EventEmitter<string>();

  value = '';
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  onFocus() {
    // Focus handling if needed
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
