import { useEffect, useState } from "react";
import { apilist } from "../services/apilist";
import axios from "axios";
import { Link } from "react-router-dom";
console.log("Dashboard loaded!");

export default function Dashboarrd() {
    const [links, setLinks] = useState([]);
    const [filteredLinks, setFilteredLinks] = useState([]);


    const [url, setUrl] = useState("");
    const [code, setCode] = useState("");

    const [urlError, setUrlError] = useState("");
    const [codeError, setCodeError] = useState("");
    const [globalError, setGlobalError] = useState("");

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const [sortField, setSortField] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");


console.log("API URL:", apilist.get_links);


    const validateUrl = (value) => {
        try {
            const u = new URL(value);
            if (u.protocol === "http:" || u.protocol === "https:") return "";
        } catch { }
        return "Enter a valid URL (http or https)";
    };

    const validateCode = (value) => {
        if (!value) return "";
        const re = /^[A-Za-z0-9]{6,8}$/;
        return re.test(value)
            ? ""
            : "Code must be 6–8 letters/numbers only.";
    };


    const fetchLinks = async () => {
        setLoading(true);
        setGlobalError("");
        try {
            const res = await axios.get(apilist.get_links);
            setLinks(res.data);
            setFilteredLinks(res.data);
        } catch (err) {
            setGlobalError("⚠ Unable to fetch links. Check backend.");
        }
        setLoading(false);
    }; 

    useEffect(() => {
        fetchLinks();
    }, []);


    useEffect(() => {
        if (!search) return setFilteredLinks(links);
        const lower = search.toLowerCase();
        setFilteredLinks(
            links.filter(
                (l) =>
                    l.code?.toLowerCase().includes(lower) ||
                    l.url?.toLowerCase().includes(lower)
            )
        );
    }, [search, links]);

    const sortLinks = (field) => {
        let newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        setSortField(field);

        const sorted = [...filteredLinks].sort((a, b) => {
            if (newOrder === "asc") {
                return a[field] > b[field] ? 1 : -1;
            } else {
                return a[field] < b[field] ? 1 : -1;
            }
        });

        setFilteredLinks(sorted);
    };

    const addLink = async () => {
        const urlErr = validateUrl(url);
        const codeErr = validateCode(code);

        setUrlError(urlErr);
        setCodeError(codeErr);

        if (urlErr || codeErr) return;

        setAdding(true);
        setSuccessMsg("");

        try {
            await axios.post(apilist.post_links, { url, code: code || null });


            setSuccessMsg("Link added successfully ✔");
            setUrl("");
            setCode("");
            setSearch("");

            fetchLinks();
        } catch (err) {
            const msg = err.response?.data?.error || "Failed to add link";
            setGlobalError("⚠ " + msg);
        }

        setAdding(false);
    };

    const deleteLink = async (c) => {
        if (!window.confirm("Delete this link?")) return;
        try {
            await axios.delete(apilist.delete_link(c));
            fetchLinks();
        } catch (err) {
            setGlobalError("Failed to delete link");
        }
    };

    const copyToClipboard = (c) => {
        navigator.clipboard
            .writeText(apilist.redirect_link(c))
            .then(() => setSuccessMsg("Copied to clipboard ✔"))
            .catch(() => setGlobalError("Copy failed"));
    };

    return (
        <div className="app-container">
            <h1 className="page-title">TinyLink Dashboard</h1>

            {globalError && <div className="state error">{globalError}</div>}

            {successMsg && <div className="state success">{successMsg}</div>}

            <div
                className="controls"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "8px",
                    width: "100%",
                    marginBottom: "20px",
                    whiteSpace: "nowrap",
                }}
            >

                <div>
                    <input
                        className="input"
                        placeholder="Enter URL"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            setUrlError(validateUrl(e.target.value));
                        }}
                        onBlur={() => setUrlError(validateUrl(url))}
                        onFocus={() => setUrlError("")}
                        style={{ width: "350px", height: "40px" }}  // fixed width
                    />

                    {urlError && (
                        <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
                            {urlError}
                        </div>
                    )}
                </div>


                <div>
                    <input
                        className="input"
                        placeholder="Custom code (optional)"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setCodeError(validateCode(e.target.value));
                        }}
                        onBlur={() => setCodeError(validateCode(code))}
                        onFocus={() => setCodeError("")}
                        style={{ width: "200px", height: "40px" }}  // fixed width
                    />

                    {codeError && (
                        <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
                            {codeError}
                        </div>
                    )}
                </div>


                <button
                    className="btn btn-primary"
                    disabled={adding || url.trim() === "" || urlError !== "" || codeError !== ""}
                    onClick={addLink}
                    style={{ height: "40px", padding: "0 18px" }}
                >
                    {adding ? "Adding..." : "Add"}
                </button>
            </div>



            <div className="search-wrapper">
                <input
                    className="input"
                    style={{ width: "100%", maxWidth: "320px" }}
                    placeholder="Search by code or URL"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading && <div className="state loading">Loading links…</div>}

            {!loading && (
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={() => sortLinks("code")} style={{ cursor: "pointer" }}>
                                    Code
                                    <span className={`sort-icon ${sortField === "code" ? "active" : "inactive"}`}>
                                        {sortOrder === "asc" && sortField === "code" ? "▲" : "▼"}
                                    </span>
                                </th>

                                <th onClick={() => sortLinks("url")} style={{ cursor: "pointer" }}>
                                    URL
                                    <span className={`sort-icon ${sortField === "url" ? "active" : "inactive"}`}>
                                        {sortOrder === "asc" && sortField === "url" ? "▲" : "▼"}
                                    </span>
                                </th>

                                <th onClick={() => sortLinks("clicks")} style={{ cursor: "pointer" }}>
                                    Clicks
                                    <span className={`sort-icon ${sortField === "clicks" ? "active" : "inactive"}`}>
                                        {sortOrder === "asc" && sortField === "clicks" ? "▲" : "▼"}
                                    </span>
                                </th>

                                <th onClick={() => sortLinks("last_clicked")} style={{ cursor: "pointer" }}>
                                    Last Clicked
                                    <span className={`sort-icon ${sortField === "last_clicked" ? "active" : "inactive"}`}>
                                        {sortOrder === "asc" && sortField === "last_clicked" ? "▲" : "▼"}
                                    </span>
                                </th>

                                <th>Actions</th>
                            </tr>


                        </thead>

                        <tbody>
                            {filteredLinks.map((l) => (
                                <tr key={l.code}>
                                    <td>
                                        <div className="code-cell">
                                            <a
                                                className="code-link"
                                                href={apilist.redirect_link(l.code)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {l.code}
                                            </a>
                                            <button className="copy-btn" onClick={() => copyToClipboard(l.code)}>
                                                Copy
                                            </button>
                                        </div>
                                    </td>

                                    <td className="small" style={{ maxWidth: 420 }}>
                                        {l.url}
                                    </td>

                                    <td>{l.clicks}</td>

                                    <td>
                                        {l.last_clicked
                                            ? new Date(l.last_clicked).toLocaleString("en-IN", {
                                                timeZone: "Asia/Kolkata",
                                            })
                                            : "-"}
                                    </td>

                                    <td>
                                        <div className="actions">
                                            <button className="btn btn-danger" onClick={() => deleteLink(l.code)}>
                                                Delete
                                            </button>
                                            <Link className="btn btn-ghost" to={`/code/${l.code}`}>
                                                Stats
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredLinks.length === 0 && (
                                <tr>
                                    <td colSpan="5">
                                        <div className="state empty">No matching links</div>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
