import React, { useEffect, useState } from "react";
import axios from "axios";
import { apilist } from "../services/apilist";


export default function Healthz() {
    const [status, setStatus] = useState(null);

    const checkHealth = async () => {
        try {
            const res = await axios.get(apilist.healthz_link);
            setStatus(res.data);
        } catch (err) {
            setStatus({ ok: false, error: err.message });
        }
    };

    useEffect(() => { checkHealth(); }, []);

    return (
        <div className="app-container">
            <h1 className="page-title">Health Check</h1>
            {status ? (
                <div className="card">
                    <div className="stats-row"><strong>OK:</strong> {status.ok ? "✅" : "❌"}</div>
                    <div className="stats-row"><strong>Version:</strong> {status.version}</div>
                    <div className="stats-row"><strong>Uptime:</strong> {status.uptime}</div>
                    <div className="stats-row"><strong>Total Links:</strong> {status.total_links}</div>
                    {status.error && <div className="stats-row"><strong>Error:</strong> {status.error}</div>}
                </div>
            ) : (
                <div className="empty">Checking health...</div>
            )}
        </div>
    );
}
