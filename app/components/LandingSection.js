export default function LandingSection() {
  return (
    <section
      style={{
        padding: "80px 64px 64px 64px",
        minHeight: "70vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "80px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "500px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "520px",
          }}
        >
          <div>
            <h1
              style={{
                fontWeight: "800",
                letterSpacing: "-0.02em",
                lineHeight: "1.0",
                color: "#1D1D0C",
                margin: "0 0 16px 0",
                fontFamily: "Tanker, sans-serif",
                fontSize: "80px",
              }}
            >
              THINGS I COULDN'T
              <br />
              KEEP TO MYSELF.
            </h1>

            <p
              style={{
                fontSize: "14px",
                color: "#1D1D0C",
                opacity: 0.6,
                margin: "0",
                lineHeight: "1.6",
                fontFamily: "Satoshi, sans-serif",
              }}
            >
              Built by me. Written by me. Shaped by whatever matters to me.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#1D1D0C",
                opacity: 0.4,
                margin: "0 0 8px 0",
                fontFamily: "Satoshi, sans-serif",
              }}
            >
              Daily Message
            </p>
            <div
              style={{
                width: "24px",
                height: "1px",
                backgroundColor: "#1D1D0C",
                opacity: 0.3,
                margin: "0 auto 16px auto",
              }}
            />
            <p
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1D1D0C",
                lineHeight: "1.3",
                margin: "0 0 8px 0",
                fontFamily: "Tanker, sans-serif",
              }}
            >
              "You're gonna carry that weight."
            </p>
            <p
              style={{
                fontSize: "14px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#1D1D0C",
                opacity: 0.6,
                margin: 0,
                fontFamily: "Aktura, sans-serif",
              }}
            >
              — Cowboy Bebop
            </p>
          </div>
        </div>

        <div
          style={{
            width: "340px",
            height: "520px",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <img
            src="/profile.jpg"
            alt="Batuhan Batur"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  )
}
