import { Page } from "./page.model";
import { Tag } from "./tag.model";
import { Embed } from "./embed.model";
import { Log } from "./log.model";

export class Test extends Page<Test> {
    id: number;
    buildId: number;
    buildDisplayId: number;
    projectId: number;
    startedAt: Date;
    endedAt: Date;
    durationMs: number;
    packageName: string;
    className: string;
    description: string;
    name: string;
    result: string;
    tags: Tag[];
    children: Test[];
    error: string;
    bdd: boolean;
    logs: Log[];
    depth: number;
    embeds: Embed[];

    history: Page<Test>;
}