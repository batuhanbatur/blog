const media = {
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: "6px",
  border: "1px solid rgba(29,29,12,0.1)",
  boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
}

const videoWrap = {
  display: "flex",
  justifyContent: "center",
  borderRadius: "6px",
  overflow: "hidden",
}

const video = {
  display: "block",
  maxHeight: "400px",
  maxWidth: "100%",
  borderRadius: "6px",
  border: "1px solid rgba(29,29,12,0.1)",
  boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
}

const h2 = {
  fontSize: "22px",
  fontWeight: "700",
  fontFamily: "Satoshi, sans-serif",
  color: "#1D1D0C",
  margin: 0,
}

const p = {
  fontSize: "16px",
  lineHeight: "1.85",
  color: "#1D1D0C",
  margin: 0,
  fontFamily: "Satoshi, sans-serif",
  opacity: 0.85,
}

const section = {
  display: "flex",
  flexDirection: "column",
  gap: "28px",
}

const link = {
  color: "#1D1D0C",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
}

function AmbientVideo({ src, title }) {
  return (
    <div style={videoWrap}>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        aria-label={title}
        style={video}
      />
    </div>
  )
}

function TourImage({ src, alt }) {
  return <img src={src} alt={alt} style={media} />
}

export default function PizzaGodTourPage() {
  return (
    <main
      className="tour-main"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "80px 24px 120px 24px",
        fontFamily: "Satoshi, sans-serif",
        backgroundColor: "#CCC6B8",
      }}
    >
      <style>{`
        html, body { background: #CCC6B8; }
        @media (max-width: 768px) {
          .tour-main { padding: 48px 20px 80px 20px !important; }
        }
      `}</style>

      {/* Opening */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "80px" }}>
        <p style={{ ...p, fontSize: "17px", opacity: 1 }}>
          Pizza God is a pizza ordering app for a restaurant that does not exist. That was intentional. I wanted to prove to myself that I could create a brand from nothing, give it an identity, and then build the product that identity deserves. This is a tour of the decisions behind it.
        </p>
        <p style={p}>
          The live site is at{" "}
          <a href="https://pizza-god.batuhanbatur.com" target="_blank" rel="noopener noreferrer" style={link}>
            pizza-god.batuhanbatur.com
          </a>{" "}
          and the code is{" "}
          <a href="https://github.com/batuhanbatur/pizza-god" target="_blank" rel="noopener noreferrer" style={link}>
            on GitHub
          </a>.
        </p>
      </div>

      <div style={{ height: "1px", backgroundColor: "rgba(29,29,12,0.1)", marginBottom: "80px" }} />

      {/* Creating the brand */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>Creating the brand</h2>
        <AmbientVideo
          src="https://eqepkemqhmiacogfsgot.supabase.co/storage/v1/object/public/status-videos/scroll-driven.mp4"
          title="Scroll-driven hero"
        />
        <p style={p}>
          The identity is a collision. Classical antiquity on one side: marble, serif typography, parchment. Street graffiti on the other: spray paint, neon, magenta drips. A god, defaced by his own worshippers.
        </p>
        <p style={p}>
          It existed before the project did. Months before I wrote any code, this was already the picture in my head, and I can't point to a single source for it. It grew out of a lifetime of influences, anime, games, street culture, things I've absorbed without keeping receipts. I'm sure many of them left fingerprints somewhere in the project, but the final identity is mine.
        </p>
        <p style={p}>
          Starting with the identity settled turned out to be a quiet advantage. Every decision that came later, from the layout down to the spray paint stroke that marks your dough selection, had a direction before it had a design.
        </p>
      </div>

      {/* The bot that can't hurt you */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>The bot that can't hurt you</h2>
        <TourImage
          src="https://eqepkemqhmiacogfsgot.supabase.co/storage/v1/object/public/status-videos/pizza-bot-allergy.webp"
          alt="PizzaBot allergy selection"
        />
        <p style={p}>
          PizzaBot is a recommendation flow backed by a language model. It asks a few questions about your group and your evening, then picks a pizza and comments on it in the god's voice.
        </p>
        <p style={p}>
          The personality comes from the model. The safety does not. It took some failures to learn where that line had to be.
        </p>
        <p style={p}>
          During testing, the model kept getting small facts wrong in ways that were funny right up until they weren't. I told it the order was just for me and it addressed "the two of you." When I corrected the setup, it switched to "one of you," which is somehow worse. A customer who selected a gluten allergy got offered a Margherita with vegan cheese, a swap nobody asked for, solving an allergy the customer didn't have. At one point it cheerfully announced "no restrictions" to someone who had just selected milk and gluten as allergens. Each of these was a wording problem I could have patched with a better prompt.
        </p>
        <p style={p}>
          Then came the one that wasn't. In a live test, the model picked a pizza containing sulphites for a customer with a sulphites allergy. A fallback check on my side caught it before it rendered, and that screenshot ended the debate. Instructions can be misread. I needed the unsafe answer to be impossible, not discouraged.
        </p>
        <p style={p}>
          So the enforcement moved out of the model entirely. When you select sulphites now, Pepperoni, Heavy Metal Queen, and Mushroom Samba are eliminated before the request ever reaches the model, because their ingredients contain sulphites: the pepperoni itself, the cured meats, the black olives. My server computes the safe list first, and the response schema limits the model's pick to those pizza IDs only. An unsafe pizza isn't discouraged. It isn't a valid answer.
        </p>
        <TourImage
          src="https://eqepkemqhmiacogfsgot.supabase.co/storage/v1/object/public/status-videos/pizza-bot-response.webp"
          alt="PizzaBot response"
        />
        <p style={p}>
          The remarks still get facts wrong sometimes. The god still has his moods. But the parts of the answer that could hurt someone are no longer his to decide.
        </p>
      </div>

      {/* Allergens as data, not decoration */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>Allergens as data, not decoration</h2>
        <TourImage
          src="https://eqepkemqhmiacogfsgot.supabase.co/storage/v1/object/public/status-videos/allergen-badges.webp"
          alt="Allergen badges"
        />
        <p style={p}>
          Every pizza carries allergen badges, and tapping one tells you which ingredient is responsible. It sounds like a small interface detail, and it's where I caught the interface lying.
        </p>
        <p style={p}>
          While testing extras, I noticed that adding a pesto drizzle made the milk badge's tooltip switch its source to parmesan, and mozzarella quietly disappeared from the explanation. The pizza still had mozzarella. The tooltip just couldn't say two things at once. The badge was technically correct that milk was present and completely wrong about why.
        </p>
        <p style={p}>
          The fix forced honest data modeling. An allergen isn't a tag on a pizza. It's a consequence of ingredients, one allergen can come from several ingredients at once, and the tooltip now lists every source. The same ingredient-level data feeds the bot's safe list, so the cards and the bot read from one source of truth and can never disagree about whether a pizza is safe.
        </p>
      </div>

      {/* Bugs that can't exist */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>Bugs that can't exist</h2>
        <AmbientVideo
          src="https://eqepkemqhmiacogfsgot.supabase.co/storage/v1/object/public/status-videos/mirror-menu.mp4"
          title="Mirrored menu and cart"
        />
        <p style={p}>
          On mobile, the menu opens from one side of the screen and the cart opens from the other. They mirror each other, which is the detail I'm quietly proudest of. And there's one thing that must never happen: both open at the same time.
        </p>
        <p style={p}>
          The usual way to handle that is a rule. Watch for one drawer opening, close the other. It works, until some future change forgets the rule exists.
        </p>
        <p style={p}>
          I chose a different route: the app simply has no way to say "both drawers are open." Its state holds one answer to one question, which panel is open right now, and the only possible answers are the menu, the cart, or neither. A bug where both appear together can't be written accidentally, because it can't be written at all.
        </p>
        <p style={p}>
          That became the idea I kept returning to throughout the project. When you find an invalid state, don't just handle it. If you can, reshape things so the invalid version has nothing to live in. It's the same idea as the bot's safe list, applied to a UI instead of an AI.
        </p>
      </div>

      {/* Turning the graffiti off */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>Turning the graffiti off</h2>
        <AmbientVideo
          src="https://eqepkemqhmiacogfsgot.supabase.co/storage/v1/object/public/status-videos/reduce-graffiti.mp4"
          title="Reducing the graffiti layer"
        />
        <p style={p}>
          All that spray paint gives Pizza God its character, but it's a lot, and for some visitors it's too much. A round button in the nav turns the graffiti layer off site-wide and remembers your choice. The classical layer underneath keeps working on its own.
        </p>
        <p style={p}>
          Building it gave me a design test I didn't expect. Every new spray, drip, or animated effect now has to answer a question at design time: what remains when you're turned off? If the answer is "the layout falls apart," it was never a layer. It was a crutch.
        </p>
      </div>

      {/* The detail I hope you find */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>The detail I hope you find</h2>
        <p style={p}>
          There's a Pizza of the Day, picked by a date-seeded function so everyone sees the same one all day, at a discount aggressive enough to need rules: stock only drops when an order actually completes, and it's one per customer.
        </p>
        <p style={p}>
          Here's the moment I built for. You can find today's pizza in the regular menu and add it from there, and it still comes in at the discounted price, because the app knows what today's pizza is no matter where you add it from. Then you think, what if I add one more? The second one comes in at full price.
        </p>
        <p style={p}>
          My favorite test of this feature is one I expected to fail. Halfway through the project I asked: if the suggested pizza is the Pizza of the Day, but customized, gluten-free dough, different cheese, does the discount survive? I went in expecting to find a bug. There wasn't one. The discount follows the pizza's identity, not its configuration, and that traces back to a data decision made in the project's first days, long before this question came up. Some days a decision you made months ago pays you back.
        </p>
        <p style={p}>
          It's a small rule, and most visitors will never test it. But someone eventually will, and when they catch it, I want them to start wondering what else on this page was thought through. That's the impression I want the project to leave. Not just that it looks different, but that its behaviour was designed as carefully as its identity.
        </p>
        <p style={p}>
          Orders themselves land in Supabase through an insert-only path. The browser can call one function, place_order, and nothing else. Reading or editing orders from the client isn't forbidden. It's simply not a path that exists. You get a 6-digit order ID and a receipt that survives closing the tab.
        </p>
      </div>

      {/* Working with AI */}
      <div style={{ ...section, marginBottom: "80px" }}>
        <h2 style={h2}>Working with AI</h2>
        <p style={p}>
          There is no team behind Pizza God. Every decision in it, product, design, and architecture, is mine. What I did have was AI tooling, used the way I'd use any power tool: it handled a lot of the implementation, and nothing it produced went in without me reviewing it, testing it, and often sending it back.
        </p>
        <p style={p}>
          The back and forth was the valuable part. AI tools reviewed my architecture, flagged edge cases, and pushed back on ideas I had become too attached to. I took the objections seriously. When a tool pointed out a real problem, I changed direction instead of defending an idea just because it was mine.
        </p>
        <p style={p}>
          But taking objections seriously cuts both ways. There were stretches where I rejected generated work repeatedly, like the spray paint assets, where after several failed attempts I stopped regenerating and took over the asset myself in Inkscape. Knowing when to stop asking and start doing turned out to be the actual skill.
        </p>
      </div>

      {/* What comes next */}
      <div style={section}>
        <h2 style={h2}>What comes next</h2>
        <p style={p}>
          Test orders exposed my favorite bug of the whole project. Ask for a recommendation for a group of 10 and the bot confidently suggests one pizza. It models a group as a single person, one set of allergies, one appetite.
        </p>
        <p style={p}>
          The next version rebuilds the flow around per-person constraints: how many of you are allergic to what, how many want meat, how hungry everyone is, what the occasion is. Then it composes an actual multi-pizza order instead of recommending one pizza for everyone. The quantity math and the allergy rules stay in deterministic code. The model keeps the interpretation, the variety, and the personality.
        </p>
        <p style={p}>
          Which is probably the clearest summary of how I approached AI throughout Pizza God. He can speak however he wants. He doesn't get to decide what's safe, and he doesn't get to do the math.
        </p>
      </div>
    </main>
  )
}
