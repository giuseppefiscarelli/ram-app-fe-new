import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVeicoloComponent } from './modal-veicolo.component';

describe('ModalVeicoloComponent', () => {
  let component: ModalVeicoloComponent;
  let fixture: ComponentFixture<ModalVeicoloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVeicoloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVeicoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
