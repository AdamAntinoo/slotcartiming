// - CORE
import { Component, Input } from '@angular/core';
// - ANIMATIONS
import { style } from '@angular/animations';
import { state } from '@angular/animations';
import { transition } from '@angular/animations';
import { animate } from '@angular/animations';
import { trigger } from '@angular/animations';
import { AppComponent } from 'src/app/app.component';
// - COMPONENTS
// import { AppPanelComponent } from '@app/modules/ui/app-panel/app-panel.component';

@Component({
    selector: 'ui-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.scss'],
    // animations: [
    //     trigger('expandCollapse', [
    //         state('collapsed', style({
    //             width: '40px',
    //             height: '100vh',
    //             backgroundColor: '#004DE6',
    //             opacity: 0.5,
    //             color: 'white'
    //         })),
    //         state('expanded', style({
    //             "font-size": '16px',
    //             color: 'white',
    //             "background-color": '#80808090',
    //             top: '2px',
    //             left: '35px',
    //             width: '500px',
    //             display: 'inline-block'
    //          })),
    //         transition('collapsed => expanded', [
    //             animate('0.3s 100ms ease-in')
    //         ]),
    //         transition('expanded => collapsed', [
    //             animate('0.3s 100ms ease-in')
    //         ]),
    //     ])
    // ]
})
export class MenuBarComponent {
    @Input() app: AppComponent;
    public menuExpanded: boolean = false;
    public sessionDuration: number =10;

    // - V I E W   I N T E R A C T I O N
    public restartAllLanes(): void {
        console.log('>[MenuBarComponent.restartAllLanes]');
        this.app.restartAllLanes();
    }
    public activateCountDown() {

    }
    public clearSession(): void {
        //     this.appStoreService.clearStore();
    }
    public increaseSessionTime() :void{
        this.sessionDuration++;
    }
    public decreaseSessionTime() :void{
        this.sessionDuration--;
    }
    public startSessionTime () :void {

    }
    public stopSessionTime() : void{
        
    }
            public toggleMenu(_target?: string): boolean {
        // if (null == _target) {
        this.menuExpanded = !this.menuExpanded;
        return this.menuExpanded;
        // } else {
        //   // we have selected an active menu element. Jump to the router link.
        // //   this.router.navigate([_target]);
        //   this.menuExpanded = false;
        // }
    }
    public toggleMenuTest(_target?: string, _event?: any): boolean {
        //     console.log(">>[VisualizeButtonsPageComponent.onClick]> event: " + JSON.stringify(_event));
        //     // Check for the modifier keys. If they are pressed then move to the Vusual Tests Dashboard
        //     if (_event.altKey && _event.ctrlKey)
        //       this.router.navigate(['visualtests/dashboard']);
        //     else if (_event.altKey)
        //       this.router.navigate(['visualtests/dashboard']);
        //     else {
        //       if (null == _target) {
        //         this.menuExpanded = !this.menuExpanded;
        //         return this.menuExpanded;
        //       } else {
        //         // we have selected an active menu element. Jump to the router link.
        //         this.router.navigate([_target]);
        //         this.menuExpanded = false;
        //       }
        //     }
        return false;
    }
    public onLostFocus(): void {
        // Loosing the focus close the menu.
        // this.menuExpanded = false;
    }
    /**
     * Check the required role level received as parameter against the current role level. Roles are transformed to level number for easy comparison.
     *
     * @returns {boolean} TRUE is the current authorization level is greater or equal to the lever requested.
     * @memberof MenuBarComponent
     */
    public requestsRole(_roleRequested: string): boolean {
        // Conver the roles to their equivalent authorization numbers.
        let requestLevel: number = this.convertRole2Level(_roleRequested);
        let loginLevel = 999;
        if (loginLevel >= requestLevel) return true;
        else return false;
    }
    protected convertRole2Level(_role: string): number {
        if (_role == 'ADMIN') return 999;
        if (_role == 'RESPONSABLE') return 300;
        if (_role == 'CALLCENTER') return 200;
        if (_role == 'USUARIO') return 100;
        return 0;
    }
}
