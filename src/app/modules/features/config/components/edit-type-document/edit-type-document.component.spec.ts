import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTypeDocumentComponent } from './edit-type-document.component';

describe('EditTypeDocumentComponent', () => {
  let component: EditTypeDocumentComponent;
  let fixture: ComponentFixture<EditTypeDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTypeDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTypeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
