import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ITreeNode} from '@bugsplat/angular-tree-component/lib/defs/api';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import {NgbActiveModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {ItemComponent} from './item.component';
import {Util} from '../lib/util';

@Component({
  selector: 'lfb-node-dialog',
  template: `
    <div class="modal-header btn-primary">
      <h4 class="modal-title text-white" id="modal-move-title">{{title}}</h4>
      <button type="button" class="close btn-primary text-white" aria-label="Close"
              (click)="activeModal.dismiss(false)"
              (keydown.enter)="activeModal.dismiss(false)"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form>
        <div class="form-group">
          <label for="moveTarget1" class="">Pick a target item to move to:</label>
          <input
                 name="name"
                 id="moveTarget1"
                 type="text"
                 [(ngModel)]="targetNode"
                 [ngbTypeahead]="search"
                 [editable]="false"
                 [inputFormatter]="formatter"
                 [resultFormatter]="resultFormatter"
                 class="form-control"
                 (focus)="focus$.next($any($event).target.value)"
                 (click)="click$.next($any($event).target.value)"
                 #searchBox="ngbTypeahead"
                 popupClass="add-scrolling"
          >

          <p class="mt-4">Specify drop location:</p>
          <ul class="list-unstyled ml-5" ngbRadioGroup [(ngModel)]="targetLocation" [ngModelOptions]="{standalone: true}">
            <li>
              <label ngbButtonLabel>
                <input ngbButton value="AFTER" type="radio">
                After the target item.
              </label>
            </li>
            <li>
              <label ngbButtonLabel>
                <input ngbButton value="BEFORE" type="radio">
                Before the target item.
              </label>
            </li>
            <li>
              <label ngbButtonLabel>
                <input ngbButton value="CHILD" type="radio">
                As a child of target item.
              </label>
            </li>
          </ul>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary"
              (keydown.enter)="activeModal.dismiss(false)"
              (click)="activeModal.dismiss(false)"
      >Cancel</button>
      <button type="button" class="btn btn-primary" [disabled]="!targetNode ? 'disabled' : null"
              (click)="activeModal.close({target: targetNode, location: targetLocation})"
              (keydown.enter)="activeModal.close({target: targetNode, location: targetLocation})"
      >{{mode}}
      </button>
    </div>
  `,
  styleUrls: ['./item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeDialogComponent implements OnInit {
  @ViewChild('searchBox') searchBox: NgbTypeahead;
  @Input()
  node: ITreeNode;
  @Input()
  item: ItemComponent;
  @Input()
  mode: ('Move'|'Insert');

  targetNode: ITreeNode;
  targetLocation = 'AFTER';
  self: NodeDialogComponent;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  sources: ITreeNode [] = [];
  title: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.self = this;
    this.item.treeComponent.treeModel.doForAll((node) => {
      this.sources.push(node);
    });
    this.title = `${this.mode} - ${this.resultFormatter(this.node)}`;
  }

  /**
   * Search through text of the source items, with input string. For empty term, show  all items.
   *
   * @param input$ - Observation for input string.
   */

  search = (input$: Observable<string>): Observable<ITreeNode []> => {
    const debouncedText$ = input$.pipe(debounceTime(100), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.searchBox.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.sources
        : this.sources.filter(el => el.data.text.toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  };


  /**
   * Format item in the results popup.
   * @param item - TreeNode object of the item.
   */
  formatter(item: ITreeNode): string {
    return Util.formatNodeForDisplay(item);
  }

  resultFormatter(item: ITreeNode): string {
    return Util.truncateString(Util.formatNodeForDisplay(item), 50);
  }

}