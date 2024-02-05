import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import {
  Node,
  Edge,
  ClusterNode,
  MiniMapPosition,
  NgxGraphModule,
} from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';
import { StatusMail, Workflow } from '../../../../domain/models';
@Component({
  selector: 'graph-workflow',
  standalone: true,
  imports: [CommonModule, NgxGraphModule, MatCardModule, MatTooltipModule],
  templateUrl: './graph-workflow.component.html',
  styleUrl: './graph-workflow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphWorkflowComponent {
  @Input() data: Workflow[] = [];
  nodes: Node[] = [];
  links: Edge[] = [];
  clusters: ClusterNode[] = [];
  curve = shape.curveLinear;
  minimapPosition: MiniMapPosition = MiniMapPosition.UpperRight;

  constructor() {}

  ngOnInit(): void {
    this.data.forEach((element, index) => {
      this.addNode(element.emitter);
      element.detail.forEach((send, subindex) => {
        const [status, classEdge, classLink] =
          send.status === StatusMail.Rejected
            ? ['Rechazado', 'circle-reject', 'line-reject']
            : send.status === StatusMail.Pending
            ? ['Pendiente', 'circle-pending', 'line-pending']
            : ['Recibido', 'circle-success', 'line-success'];
        this.links.push({
          id: `a${subindex}-${index}`,
          source: element.emitter.cuenta,
          target: send.receiver.cuenta,
          label: `${index + 1}`,
          data: {
            status,
            classEdge,
            classLink,
          },
        });
        this.addNode(send.receiver);
        // this.addClusterIfNotFount(send.emitter);
        // this.addClusterIfNotFount(send.receiver);
      });
    });
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
}
