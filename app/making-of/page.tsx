import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function MakingOfPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">The Making Of Tako Gallery</h1>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Motivation</h2>
                    <p className="text-gray-700 mb-4">
                        I wanted to toy around with the <a className="cursor-pointer text-blue-600 hover:text-blue-800" href="https://docs.trytako.com/documentation/getting-started/what-is-tako/introduction">Tako API</a> and experiment with some 'vibe coding' tools.
                        Tako is a data visualization service takes natural language queries, finds relevant data, then autogenerates charts for that data.
                    </p>
                    <p className="text-gray-700 mb-4">
                        I thought building a gallery to showcase visualization 'cards' would give me a good feel for their API.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Vibe Coding Tech Stack</h2>
                    <p className="text-gray-700 mb-4">
                        For those unfamiliar, 'vibe coding' is like actual coding, aside from the part where you write code.
                        Basically, all you do is plan, then just have an AI agent do everything else for you.
                        One imagines he is tasting what it is like to be a project manager in the sci-fi future.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Anyways, For this project, I used:
                    </p>
                    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                        <li><strong>Initially:</strong> Vercel&apos;s v0 - I used this for the first half of the project</li>
                        <li><strong>Later:</strong> VSCode with the Cline extension and Claude Sonnet 3.7 - I switched to this setup when the project complexity increased</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">The Vibe Coding Process</h2>
                    <p className="text-gray-700 mb-4">
                        Step one is to create a roadmap.
                    </p>
                    <p className="text-gray-700 mb-4">
                        When I plan to let the AI loose to do as it may, I find it helpful to pre-establish some clear direction.
                        Helps keep it on track.
                        You could craft this yourself, carefully planning out how you want the project to look,
                        ensuring you're keeping best practices in mind, minimizing complexity, so on and so forth,
                    </p>
                    <p className="text-gray-700 mb-4">
                        Or... you could just have the AI do all that for you too.
                        Usually I beseech the most advanced reasoning model I happen to be paying for, but this time I just asked Vercel's v0, since I wanted to try it out.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Prompt Structure</h3>
                    <p className="text-gray-700 mb-4">
                        The structure I use for most big prompts is something like:
                    </p>
                    <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                        <li><strong>Initial ask:</strong> What I want from the AI, as simply as I can phrase it</li>
                        <li><strong>Context:</strong> Elaboration on the ask, details, exceptions, immediately relevant info like API definitions.</li>
                        <li><strong>My life story:</strong> Anything relevant that comes to mind. Why I want the thing built, what I&apos;m going to use it for, what features I want to see, childhood trauma that's made me the person I am today.</li>
                        <li><strong>(Optionally):</strong> Reiterate ask. Literally I just repeat the initial ask at the end of a long prompt. Dunno if this is necessary, but it feels useful sometimes</li>
                    </ul>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Example: Initial Design Doc Prompt</h4>
                        <details className="mb-4">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                The prompt I used to generate the design document:
                            </summary>
                            <div className="mt-3 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-96">
                                <pre className="whitespace-pre-wrap">
                                    {`I'd like to build the applet as a gallery of 'cards' from generated from queries to the Knowledge Search API of the company Tako. Tako is a company that automatically generates charts from semantic search queries.

Can you construct a plan for the applet such that:
- It accepts a Tako API key and a query string, which it uses to run a Tako Knowledge search
- It then saves the resulting card to a hosted mongodb atlas database (I will save the atlas database credentials as the \`MONGODB_URI\` environment variable)
- It hashes the Tako API key, stores that in the database, then associates a 'collection' of cards with each unique API key
- Allows the user to choose a unique 'username' for the API Key/collection, which will be the URL endpoint for users to view all cards generated with that API Key
- Allows a user to delete a card by entering the API key used to generate it.
- It is all hosted on vercel

Don't produce any code just yet. First let's create a design specification and implementation plan for this applet. Try to minimize complexity. Write the plan with an AI coding agent in mind.

---

For context, here is the API specification for the Tako Knowledge Search API:
[... API documentation was pasted here ...]

---

The goal for the gallery applet is to create a sort of stateless public archive of Tako queries. Anyone with a Tako API key can use the applet, but the applet itself has minimal authentication--essentially piggybacking off of Tako's own auth setup, and storing only the necessary credentials to use my mongodb atlas cluster and to associate cards with API keys to have separate collections. The database should also only store the json representations of the Tako cards, taking advantage of the fact that tako hosts the meat of the representation.

Tako cards should be shown in a minized form and should expand when selected. Expanded Tako cards should furthermore have an option to show their associated grounding info. 

The webapp should automatically generate a new collection page when an as-yet unused API key is used *successfully* to make a query, and should prompt the user of the API key to select a username, which will then be used as the URL endpoint for the user's collection page.`}
                                </pre>
                            </div>
                        </details>
                        <p className="text-gray-700 text-sm">
                            The result of this prompt was a reasonable enough design doc, which I saved to my project as
                            <a href="https://github.com/matthewabbott/tako-gallery/blob/master/v0-implementation-plan.md?plain=1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline mx-1">
                                v0-implementation-plan.md
                            </a>
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Creating a Roadmap</h4>
                        <p className="text-gray-700 mb-4">
                            I want the AI to have a plan. I don't want it to do everything at once. Thus we request:
                        </p>
                        <details className="mb-4">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                The roadmap prompt
                            </summary>
                            <div className="mt-3 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-96">
                                <pre className="whitespace-pre-wrap">
                                    {`Given this specification document, can you devise a series of commits to take this project from scratch to a production ready state? Start from the initial commit with just vercel project scaffolding, then describe what code to write at each step to build that scaffold into the full gallery, collection, and database app described in the design specification.

Each enumerated commit should include a list of files to modify, the functions of those files, and what state the project will be in before and after the commit. An AI coding agent will later implement each commit in turn, so please ensure the commits are written with that in mind.

Please enumerate the commits that we will need to perform.`}
                                </pre>
                            </div>
                        </details>
                        <p className="text-gray-700 text-sm">
                            The result was a list of (relatively) small additions that together add up to the project. Saved as
                            <a href="https://github.com/matthewabbott/tako-gallery/blob/master/roadmap.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline mx-1">
                                roadmap.md
                            </a>
                        </p>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Development Journey</h2>
                    <p className="text-gray-700 mb-4">
                        With all that ready, I set up a <a className="cursor-pointer text-blue-600 hover:text-blue-800" href="https://github.com/matthewabbott/tako-gallery">Github Repository</a> and then started asking v0 for files.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The v0 Phase</h3>
                    <p className="text-gray-700 mb-4">
                        v0 breezed through the initial commits with no problems. It set up the project structure, implemented the Tako API integration,
                        and created the database models. My initial dump of the Tako API documentation proved to be sufficient for it to just figure everything out with no further direction.
                    </p>
                    <p className="text-gray-700 mb-4">
                        I had to step in briefly when setting it up to associate all requests with the same API key to the same user.
                        My fault, really, that the AI didn't understand what I was doing. It made sense at the time:
                    </p>
                    <p className="text-gray-700 mb-4">
                        'All requests made by the same API key go to the same collection. Therefore, the API key defines the collection.'
                        Simple. Elegant even, if you're lying to yourself about your motivations so you can avoid rolling auth.
                        Anyways, much like a human, the AI gets confused when presented with wacky kludges so I had to help it out.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Anyways after tweaking that, v0 successfully completed through commit 12 in the roadmap (embedding Tako cards in the page). No major issues.
                        Commit 13, however, (creating a collection page to display all a user&apos;s cards) proved too much for it.
                        I suspect the issue was that I asked it to deviate from the original roadmap
                        and store collections at the endpoint <code>/collections/[username]</code>, rather than just <code>/[username]</code>.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Switching to Cline + Claude</h3>
                    <p className="text-gray-700 mb-4">
                        At this point, the v0 context was becoming cumbersome, and the issues were becoming difficult to resolve with pure,
                        thoughtless vibe coding. I decided to switch to my normal workflow of using VSCode with the <a className="cursor-pointer text-blue-600 hover:text-blue-800" href="
                    https://cline.bot/">Cline</a> extension and Claude Sonnet 3.7.
                    </p>
                    <p className="text-gray-700 mb-4">
                        From there, I implemented the rest of the commits, mostly using a prompt scaffold like this:
                    </p>

                    <details className="mb-4">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                            Example prompt for Cline x Sonnet
                        </summary>
                        <div className="mt-3 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-96">
                            <pre className="whitespace-pre-wrap">
                                {`I've been working on this webapp that's mean to be a gallery project of 'cards' from Tako, a data-visualization service. Now I need to add a readme and some documentation, which would be step 21 of an ongoing implementation plan, described here:

\`\`\`
## Commit 21: Final Polishing and Documentation

**Files to create/modify:**

- \`README.md\`
- \`app/about/page.tsx\`
- Various component updates for final polish


**Functions:**

- Create comprehensive documentation
- Add about page with usage instructions
- Final UI polish and consistency checks
- Prepare for production deployment


**State before:** Project with analytics but limited documentation
**State after:** Production-ready project with complete documentation
\`\`\`

For full context, see the roadmap.md file.
For the design spec that this exists within, see v0-implementation-plan.md.

Could you help me add a readme and an about page to this webapp?`}
                            </pre>
                        </div>
                    </details>

                    <p className="text-gray-700 mb-4">
                        Notably, I never had to provide the Tako API specification again. Simply pointing the AI to my
                        existing <code>v0-implementation-plan.md</code> and letting it read from my files was enough for it to make
                        no errors (that I'm aware of) while interfacing with Tako or MongoDB.
                    </p>
                    <p className="text-gray-700 mb-4">
                        I even expanded my filtering setup to use more Tako response info (methodology, source name, source index),
                        and a dump of the documentation page contents <a className="cursor-pointer text-blue-600 hover:text-blue-800" href="https://docs.trytako.com/api-reference/search">here</a> was sufficient for that too.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Lessons Learned</h2>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-3">Vibe Coding Tips</h3>
                        <ul className="space-y-4">
                            <li className="flex">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Make a plan and force the AI to follow it.</h4>
                                    <p className="text-gray-700">
                                        Building out a clear set of goals and steps makes the vibe coding process much smoother.
                                    </p>
                                    <p className="text-gray-700">
                                        Do NOT abide deviations from the plan. Sonnet 3.7 especially is sneaky and likes to go out of scope.
                                        If you think the AI has a good idea, then you should probably make a sub-plan for it.
                                    </p>
                                    <p className="text-gray-700">
                                        And by 'you' I mean 'the AI'. You can have it write all that for you.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Version control, my beloved.</h4>
                                    <p className="text-gray-700">
                                        Make small commits. Validate that Claude (or your companion of choice) has not borked your project between changes.
                                        That way when there's a problem, you can just undo it and make the AI start over, rather than actually having to fix things ever.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">If you have to troubleshoot, summon another AI.</h4>
                                    <p className="text-gray-700">
                                        Usually if an AI gets something wrong, it's probably because it doesn't know how to do it right.
                                        If you tell it to fix it it might just flounder and make things worse. IMO it's best to ask another artificial friend to get a fresh pair of figurative eyes on it.
                                    </p>
                                    <p className="text-gray-700">
                                        (or just stop vibe coding for a moment and debug it yourself).
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">4</span>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">If plans change, update your plan docs.</h4>
                                    <p className="text-gray-700">
                                        I had a lot of failure telling the AI to make tweaks at runtime. Better to go to the source of truth and adjust the plan you told the AI to follow.
                                        Also helps stop the AI from getting confused later by looking at a plan that's out of sync with the actual implementation.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">5</span>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Provide API documentation upfront</h4>
                                    <p className="text-gray-700">
                                        Dumping the API documentation into the initial prompt just worked out really well for me.
                                        I dunno if this is a 'lesson', because really it was my first instinct, but it went quite well. Would recommend.
                                    </p>
                                    <p className="text-gray-700">
                                        Perhaps a point in favor of the 'simple ask, context, life story' prompt structure, and also favor of the Tako API definition.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The Main Snag</h3>
                    <p className="text-gray-700 mb-4">
                        But yeah the main issue I ran into in all this that REALLY required me to stop vibe coding and instead troubleshoot manually was related to
                        performance optimizations. Later in the project, (the roadmap's step 19), I got it in my head to try a bunch of pre-fetching and caching tricks
                        but once I had it all set up, I realized these tricks were making it so new cards wouldn't show up after being created.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Ultimately I wound up reverting the whole feature, since I let it get pretty entangled in there and the AI was just trying ineffectual
                        cache-busting strategies that were adding a bunch of complexity while not fixing the problem.
                        Pretty sure the revert is in the commit history somewhere, if you wanted to go see my shame.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Now though, the project is finished. Check it out! Generate some cards of your own!
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">See It In Action</h2>
                    <p className="text-gray-700 mb-4">
                        Here&apos;s an example of a Tako card generated and stored in the gallery:
                    </p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-3">Example Tako Card</h3>
                        <div className="aspect-video w-full mb-4">
                            <iframe
                                src="https://tako-gallery-ten.vercel.app/collections/ttobbattam/5n5dvFru-_ijWBKH7drq"
                                className="w-full h-full border-0 rounded"
                                title="Example Tako Card"
                            ></iframe>
                        </div>
                        <p className="text-gray-700 text-sm">
                            This card is hosted in a collection on Tako Gallery. You can create your own collections by using the search form on the
                            <Link href="/" className="text-blue-600 hover:underline mx-1">home page</Link>.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Try It Yourself</h2>
                    <p className="text-gray-700 mb-4">
                        <a className="cursor-pointer text-blue-600 hover:text-blue-800" href="https://trytako.com/dashboard/">Get a Tako API key</a> and start generating visualizations!
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 h-10 py-2 px-4"
                        >
                            Create Your Collection
                        </Link>
                        <Link
                            href="/explore"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400 h-10 py-2 px-4"
                        >
                            Explore Existing Collections
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
