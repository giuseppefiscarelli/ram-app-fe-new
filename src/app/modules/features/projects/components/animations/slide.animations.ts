import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('in', style({
            'height': '*', 'opacity': '1',
        })),
        state('out', style({
            'height': '0px', 'opacity': '0',
        })),

        transition('in => out', [group([
            animate('300ms ease-in-out', style({
                'opacity': '0'
            })),
            animate('800ms ease-in-out', style({
                height: '0px',
            })),
         /*   animate('900ms ease-in-out', style({
                'display': 'none'
            }))*/
        ]
        )]),

        transition('out => in', [group([
          /*  animate('1ms ease-in-out', style({
                'display': 'block'
            })),*/
            animate('800ms ease-in-out', style({
                height: '*',
            })),
            animate('200ms 600ms ease-in-out', style({
                'opacity': '1'
            })),
        ]
        )])



    ])



]
