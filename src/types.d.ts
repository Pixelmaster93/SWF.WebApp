export interface Achievement {
    code: string;       // PK
    name: string;       // Title
    description: string;// Description (might be "???" if secret)
    isSecret: boolean;
    xpValue: number;
    isUnlocked: boolean;
}
