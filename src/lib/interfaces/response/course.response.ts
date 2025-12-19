import type { KeyCompetencyTableType, MasterTableType, ModuleTableType, ThematicTableType, TrainingTableType } from "@/db";


export interface CourseResponse extends TrainingTableType {
    modules?: ModuleTableType[];
    competencies?: KeyCompetencyTableType[];
    thematic?: ThematicTableType;
    master?: MasterTableType;
}