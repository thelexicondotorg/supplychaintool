
export type SectionType =
    "fonio"
    | "amaranth-local"
    | "amaranth-intl"
    | "small-millets";
    
export interface IIntroSupplyChain {
    supplyChain: string | IIntroSupplyChain[];
    name: string;
    location: string;
}
