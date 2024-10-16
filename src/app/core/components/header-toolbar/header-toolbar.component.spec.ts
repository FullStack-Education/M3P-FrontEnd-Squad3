import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHeaderToolbarComponent } from './header-toolbar.component';

describe('HeaderToolbarComponent', () => {
  let component: AppHeaderToolbarComponent;
  let fixture: ComponentFixture<AppHeaderToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeaderToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
