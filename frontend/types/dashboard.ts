export interface DashboardData {
    documents: number;
    equipment: number;
    ai_insights: number;
    compliance_alerts: number;
    system_health: string;

    recent_documents: {
        name: string;
        type: string;
        status: string;
    }[];

    ai_recommendations: string[];
}