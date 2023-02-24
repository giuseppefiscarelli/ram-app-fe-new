import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { TYPE } from './values.constants';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class NotificationsComponent {
  show(typeIcon = TYPE.SUCCESS,title:string, text?:string, showCancelButton?: boolean) {
    Swal.fire({
      title,
      text,
      icon: typeIcon,
      confirmButtonText: 'OK',
      showCancelButton,
      cancelButtonText: 'Chiudi'
    });
  }
  async data() {
    const { value: formValues } = await Swal.fire({
      title: 'Multiple inputs',
      html:
        '<input id="swal-input1" class="swal2-input">' +
        '<input id="swal-input2" class="swal2-input">',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Anartz",
      focusConfirm: false, //No poner el foco en el botóón de confirmar
      preConfirm: () => {
        const val1 = (document.getElementById('swal-input1') as HTMLInputElement).value;
        console.log(val1);
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ]
      }
    })

    if (formValues) {
      Swal.fire(JSON.stringify(formValues))
    }
  }
  async options() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-warning'
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons.fire(
    {
      showCloseButton: true,
      title: 'Seleccione acción',
      text: 'Seleccione la acción a realizar',
      showCancelButton: true,
      confirmButtonText: 'Tarjeta de Control',
      cancelButtonText: 'Picnic',
      reverseButtons: false
    }
    ).then((result) => {
      if (result.value) {
        console.log('dddd');
        return;
      }
      console.log('cancel');
    });
  }

  toast(typeIcon = TYPE.SUCCESS, title:string, text?:string, timerProgressBar: boolean = false) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      icon: typeIcon,
      timerProgressBar,
      timer: 5000,
      title,
      text
    })
  }

}
