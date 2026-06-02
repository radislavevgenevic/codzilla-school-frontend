export const style = {
    sidebar: {
        width: "100%",
        maxWidth: "250px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #C1C6D5",
        height:"95%",
        position: "sticky",
        top: "90px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    title: {
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "20px",
    },
    list: {
        listStyle: "none",
        padding: 0,
    },
    listItem: {
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s",
        "&:hover": {
            backgroundColor: "#e0e0e0",
        },
    },
    selectedListItem: {
        backgroundColor: "#1976d2",
        color: "#fff",
    },
};
