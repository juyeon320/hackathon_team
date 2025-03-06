import Link from "next/link";

const Footer = () => {
  const buttons = [
    { imgSrc: "/images/seeds.png", path: "/experience", alt: "작물" },  
    { imgSrc: "/images/home.png", path: "/categorySelect", alt: "홈" },  
    { imgSrc: "/images/c2.png", path: "/hallOfFame", alt: "명예의 전당" },  
  ];

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(8px)",
        padding: "20px 0",
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          padding: "0 24px",
        }}
      >
        {buttons.map((button, index) => (
          <Link
            key={index}
            href={button.path}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px", // 이미지 크기 조정
              height: "64px",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img 
              src={button.imgSrc} 
              alt={button.alt} 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }} 
            />
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;