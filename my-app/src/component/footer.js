import Link from "next/link";

const Footer = () => {
  const buttons = [
    { label: "작물", path: "/experience" },
    { label: "홈", path: "/categorySelect" },
    { label: "명예의 전당", path: "/hallOfFame" },
  ];

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "transparent",
        color: "white",
        padding: "20px 0",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
          padding: "0 24px",
        }}
      >
        {buttons.map((button, index) => (
          <Link
            key={index}
            href={button.path}
            style={{
              display: "block",
              width: "100%",
              maxWidth: "180px",
              padding: "24px 36px",
              fontSize: "18px",
              fontWeight: "600",
              textAlign: "center",
              backgroundColor: "orange",
              borderRadius: "8px",
              textDecoration: "none",
              color: "white",
              transition: "background-color 0.3s",
              marginBottom: "24px",
            }}
          >
            {button.label}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;