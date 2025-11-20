import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { apilist } from "../services/apilist";
import { useCallback } from "react";

export default function Stats() {
    const { code } = useParams();

    const [link, setLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(apilist.link_details(code));
            setLink(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch stats");
        } finally {
            setLoading(false);
        }
    }, [code]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);


    if (loading) {
        return (
            <div className="app-container">
                <h1 className="page-title">Stats</h1>

                <div className="card">
                    <div className="stats-row"><strong>URL:</strong> <span className="skeleton-line" /></div>
                    <div className="stats-row"><strong>Clicks:</strong> <span className="skeleton-line" /></div>
                    <div className="stats-row"><strong>Last Clicked:</strong> <span className="skeleton-line" /></div>
                    <div className="stats-row"><strong>Created At:</strong> <span className="skeleton-line" /></div>
                </div>

                <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-container">
                <h1 className="page-title">Stats</h1>

                <div className="card" style={{ color: "red" }}>
                    <strong>Error:</strong> {error}
                    <br /><br />
                    <button className="btn btn-primary" onClick={fetchStats}>Retry</button>
                </div>

                <Link to="/" className="btn btn-ghost" style={{ marginTop: 12 }}>
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    if (!link) {
        return (
            <div className="app-container">
                <h1 className="page-title">Stats</h1>
                <div className="empty">No data found.</div>
                <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
                    Back to Dashboard
                </Link>
            </div>
        );
    }



    return (
        <div className="app-container">
            <h1 className="page-title">Stats for {link.code}</h1>

            <div className="card" style={{ maxWidth: 760 }}>
                <div className="stats-row">
                    <strong>URL:</strong>
                    <a href={link.url} target="_blank" rel="noreferrer" className="code-link">
                        {link.url}
                    </a>
                </div>

                <div className="stats-row"><strong>Clicks:</strong> {link.clicks}</div>

                <div className="stats-row">
                    <strong>Last Clicked:</strong>{" "}
                    {link.last_clicked
                        ? new Date(link.last_clicked).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                        : "-"}
                </div>

                <div className="stats-row">
                    <strong>Created At:</strong>{" "}
                    {new Date(link.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </div>
            </div>

            <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
                Back to Dashboard
            </Link>
        </div>
    );
}
