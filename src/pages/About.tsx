import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
const About = () => {
  return (
    <div className="min-h-screen gradient-bg p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Navigation currentPage="about" />

        <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8" style={{ color: 'hsl(0 0% 85%)' }}>About Number One Rules</h1>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
              Why start writing down "Number One Rules"?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I loved the idea Marcus Aurelius followed - keeping a journal that would help him become a better parent,
              friend, stoic and emperor. He never meant to publish it. Yet here we are almost two thousands year later
              still finding pragmatic and overarching truths as we read it. I'm nowhere near thinking the "Number One
              Rules" would have a similar depth, weight and impact. I'm simply in love with the idea of putting thoughts
              "to paper", sharing them and letting things take shape. The main audience I kept in mind was my family,
              friends and self. The name "Number One Rules" comes from a running joke we had with the team at work.
              Whenever someone would make a mistake, the comment would usually be: "How could you forget the No. 1 Rule?
              Always ask for a discount!" or something of the sort.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Not because it's an invaluable resource, but I can't escape the feeling that it could be a waste not to
              share any of the insights. Each of these at some point resonated deeply, helping make sense of a situation
              and hinting to a practical next step. If the same happens to a reader - fantastic! If not - nothing is
              lost. I would be absolutely delighted to see the rules of every person I've collaborated with in any
              capacity. Wouldn't it be like having a magical window into a person's way of thinking? You can also think
              of it as a &quot;Working with...&quot; doc on steroids. The plan is to openly invite friends and
              colleagues to review and contribute. No great deeds can be accomplished on your own after all.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These are not necessarily eternal truths. Just claims I believe, but also just as willing to doubt at the
              exact same time. When applied or instantiated in a practical scenario - absolutely, one must make a choice
              what is true and live with the consequences. But in abstract context they're absolutely up for debate and,
              hopefully, improvement. What was true yesterday, needn't be true today. And vice versa. The contradictions
              are probably numerous, the wording imperfect, the advertised pragmatism hidden, but it beats an empty page
              or thoughts lost the next morning. Yet, the sense of some fundamental principles or a system of thought is
              present, e.g. a call for compassion, a belief in common human decency, and yes - welcoming of
              contradictions, mistakes and disagreements, even if its just an internal monologue. I totally expect to
              apply changes myself on a regular basis and keep this as a live document. I'm positive there's beautiful
              rules to be recorded, disproved and re-discovered. Last thing we need is another bible.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Many claims were born out of research studies I read, mature schools of thought that intrigued or
              resonated with my own understanding of the world, or approaches that happened to repeatedly prove
              themselves in practice. However, I haven't tested all the hypothesis or respected the scientific method in
              developing the arguments for any of the rules. Still I believe in their truthfulness and, most of all,
              practicality in times of trouble, i.e. all of the continuous strife we call life. This I find as critical,
              because one would only sit down and read anything similar to find an answer. Sometimes for a very specific
              reason, sometimes out of thirst to find one. In every book, training or whatever knowledge resource you
              find - you don't intend to learn it by heart and apply dogmatically. You hope to discover a few things
              that would really count. The ones you would apply today and hopefully keep applying for the days to come.
              Others you'll forget and hopefully come back to later when their time comes. This is why I tried to filter
              them, because I'm convinced a time for each of these will come. And we'll never know when.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Going over the list too many and never enough times I always catch myself thinking just how cliché some of
              the rules are. This can certainly cause some to stop reading or skipping with increased confidence they
              could afford it. At the same time, clichés are often just simple truths that we're willing to keep at the
              mind's bottom at best meaning that bringing them up at the right time could be a spark for a "why didn't I
              think of that earlier" type of moment. So I kept them. After all, doesn't every good song sound at least
              vaguely familiar?
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">What's perfec™?</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">Perfec™ is:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>the celebration of being one better than yesterday</li>
              <li>the joy of mistakes as growth opportunities</li>
              <li>the understanding that bad and better coexist</li>
              <li>the feeling at home when things go "boom"</li>
              <li>the belief that if you cannot change something then it's perfect</li>
              <li>
                the acceptance of the human condition as our once in a lifetime opportunity to propel an infinite
                progression
              </li>
              <li>the gratification of pragmatism replacing the insecurity behind perfectionism</li>
              <li>the euphemism for our inescapable "bounded rationality"</li>
              <li>the perception of a scratch on your phone screen as uniquely yours</li>
              <li>the embracing of uncertainty, pain and constant work as life's only guarantees</li>
              <li>not a typo</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
              Why format the rules this way?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The short title is for reference, but also to hopefully inspire a rhyming thought or sentiment with the
              reader. The description is meant to be long enough to provide the essence of a personal interpretation of
              a rule paired with anecdotal examples and/or stories to back it up. The categories I used refer to the
              three stoic disciplines (will, action, perception), three areas one person should professionally develop
              (self-, people and business/process management) and the contemporary, for the lack of a better word
              "corporate"-sounding skills used only to help organize the content in a manner slightly more intuitive
              than a randomly numbered list.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
              Why do I believe "Number One Rules" hold any water?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Because they helped me or those around me move forward. Most tangibly this happened in the context of a
              company which I was lucky to be part of building. It was called Melon and got acquired around its 20th
              birthday. The name lost, but the spirit and values certainly not. In its prime it was often referred to as
              the "hidden gem". A cause for many locals to reignite their belief that there's an alternative to the
              "kiss up, kick down" attitude traditionally and lazily perceived the only possibility in a Balkan company.
              And a cause for many non-Balkan clients and partners to rediscover value and humanity where perhaps they'd
              not expect it. From beginning to end, I'm willing to argue it was living proof that a strong moral compass
              doesn't come at a cost of success. Which, I guess, would depend on any single person's definition, but
              this is exactly the type of discussion I would enjoy having.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">The AI factor</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As I started writing these a parallel phenomenon was developing in the wider ether of reality. Artificial
              intelligence broke out from an abstract computer science term sporadically mentioned. and much less
              frequently understood, into anything from a life-changing, career-threatening tech to the final omen of
              our species' self-destructive tragicomic exit from meaningful existence. While I certainly joined
              following the news and the possibilities accompanying AI tools, the main question I kept asking was how
              the hell will this influence us sense of being human, mostly with each other. Drawing an analogy between
              the AI revolution and, say, industrial or internet revolution I don't think does it justice. The shift
              will be faster, deeper and broader.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              What happens when in a matter of several years hundreds of millions lose their jobs and more often than
              we'd like to think - their sense of purpose? As of yet, I've been (willfully, at that) unemployed for two
              months and the struggle to find purpose and everything that comes with it is very real. And this is just
              the more or less foreseeable beginning. Reality distortion mechanisms already in play will get
              supercharged, governments and regulatory systems will be vastly unprepared, other ongoing crises like
              global warming and major conflicts are likely too exacerbate as the focus shifts to the inevitable AI arms
              race. What do we do as parents? What do we do as friends and community members? What do we do as a species
              and, as far as we can tell, only self-aware inhabitants of Earth already barely managing the rapid changes
              around us?
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As the willful suspension of disbelief kicks in, I started finding solace in truths that permeated across
              the ages as its the best I can come up with despite the claimed unprecedented impact I expect. I'm open to
              other suggestions (giving up on humanity is not on the menu). What I think we will need to do is to
              "out-human" AI. Come back to ourselves and each other. No one else will, I imagine. Not the governments,
              not the corporations or the messianic figures of today (e.g. "tech bros"). There's going to be pain,
              uncertainty and constant work - the only things anyone could ever guarantee. And, naively, I think there
              could be bits and pieces we can find in these rules that could be just enough to assemble a life-worthy
              puzzle.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Oh, by the way: all content of the "Number One Rules" is human-generated. AI, if used, will be only to
              help usability and accessibility of the content, not creating or changing it beyond a rudimental
              spellcheck. That's for us humans to do, while we still can.
            </p>
          </section>
        </article>
      </div>

      <Footer />
    </div>
  );
};
export default About;
