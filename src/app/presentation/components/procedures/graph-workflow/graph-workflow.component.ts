import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import {
  Node,
  Edge,
  ClusterNode,
  MiniMapPosition,
  NgxGraphModule,
} from '@swimlane/ngx-graph';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import * as shape from 'd3-shape';
import { StatusMail, Workflow } from '../../../../domain/models';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { PaginatorComponent } from '../../paginator/paginator.component';
@Component({
  selector: 'graph-workflow',
  standalone: true,
  imports: [
    CommonModule,
    NgxGraphModule,
    MatCardModule,
    MatTooltipModule,
    OverlayModule,
  ],
  templateUrl: './graph-workflow.component.html',
  styleUrl: './graph-workflow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphWorkflowComponent {
  @Input() data: Workflow[] = [];
  public nodes: Node[] = [];
  public links: Edge[] = [];
  public curve = shape.curveLinear;
  public clusters: ClusterNode[] = [];
  public minimapPosition: MiniMapPosition = MiniMapPosition.UpperRight;
  isOpen = false;
  @ViewChild('myTemplate') myTemplateRef!: TemplateRef<any>;
  @ViewChild('mybtn') btn!: ElementRef<any>;
  private overlayRef?: OverlayRef;

  constructor(
    private overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    const listUsers: Record<string, Node> = {};
    this.data.forEach((stage, index) => {
      listUsers[stage.emitter.cuenta] = {
        id: stage.emitter.cuenta,
        label: 'ds',
        data: {
          fullname: stage.emitter.fullname,
          jobtitle: stage.emitter.jobtitle ?? 'SIN CARGO',
        },
      };
      stage.dispatches.forEach((dispatch) => {
        listUsers[dispatch.receiver.cuenta] = {
          id: dispatch.receiver.cuenta,
          label: 'ds',
          data: {
            fullname: dispatch.receiver.fullname,
            jobtitle: dispatch.receiver.jobtitle ?? 'SIN CARGO',
          },
        };
      });
      stage.dispatches.forEach((dispatch, subindex) => {
        const [status, classEdge, classLink] =
          dispatch.status === StatusMail.Rejected
            ? ['Rechazado', 'circle-reject', 'line-reject']
            : dispatch.status === StatusMail.Pending
            ? ['Pendiente', 'circle-pending', 'line-pending']
            : ['Recibido', 'circle-success', 'line-success'];
        this.links.push({
          id: `a${subindex}-${index}`,
          source: stage.emitter.cuenta,
          target: dispatch.receiver.cuenta,
          label: `${index + 1}`,
          data: {
            status,
            classEdge,
            classLink,
          },
        });
      });
    });
    this.nodes = Object.values(listUsers);
    console.log(this.data);
  }

  addNode(user: any): void {
    const foundUser = this.nodes.some((node) => node.id === user.cuenta);
    if (foundUser) return;
    this.nodes.push({
      id: user.cuenta,
      label: `funcionario-${user.cuenta}`,
      data: {
        // dependencia: participant.cuenta.dependencia.nombre,
        // institucion: participant.cuenta.dependencia.institucion.nombre,
        officer: user.fullname,
        jobtitle: user.jobtitle ?? 'Sin cargo',
      },
    });
  }
  addClusterIfNotFount(participant: any): void {
    const indexFoundInstitution = this.clusters.findIndex(
      (cluster) => cluster.id === participant.cuenta.dependencia.institucion._id
    );
    if (indexFoundInstitution === -1) {
      this.clusters.push({
        id: participant.cuenta.dependencia.institucion._id,
        label: `Institucion: ${participant.cuenta.dependencia.institucion.sigla}`,
        childNodeIds: [participant.cuenta._id],
      });
    } else {
      this.clusters[indexFoundInstitution].childNodeIds?.push(
        participant.cuenta._id
      );
    }
  }
  ope(element: HTMLElement) {
    if (this.overlayRef) this.overlayRef.dispose();
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(element)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
          },
        ]),
    });
    const portal = new TemplatePortal(
      this.myTemplateRef,
      this._viewContainerRef
    );
    this.overlayRef.attach(portal);
    this.overlayRef.detachBackdrop();
    this.overlayRef.outsidePointerEvents().subscribe(() => {
      this.overlayRef?.dispose();
    });
  }
}
