import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCertComponent } from './modal-cert.component';

describe('ModalCertComponent', () => {
  let component: ModalCertComponent;
  let fixture: ComponentFixture<ModalCertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
