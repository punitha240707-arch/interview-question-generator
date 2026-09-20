import { InterviewPackage, InterviewQuestion } from '../types';
import { defaultJavaInterviewData } from '../data/defaultJavaData';

/**
 * Client-side fallback generator for environments without a backend (such as GitHub Pages static hosting).
 * Guarantees that users on GitHub Pages always get a complete set of 10 Technical + 5 HR questions.
 */
export function generateClientInterview(
  role: string,
  experienceLevel: string = 'Mid-Level',
  focusArea: string = ''
): InterviewPackage {
  const normalizedRole = role.toLowerCase().trim();

  // If role is Java Developer, return the curated high-depth dataset adjusted for seniority
  if (normalizedRole.includes('java') && !normalizedRole.includes('javascript')) {
    return {
      ...defaultJavaInterviewData,
      role,
      experienceLevel,
      focusArea: focusArea || defaultJavaInterviewData.focusArea,
      summary: `Tailored 10 Technical and 5 HR Questions for ${experienceLevel} ${role}, covering JVM, memory, concurrency, Spring Boot, and error diagnostics.`,
    };
  }

  // Frontend / React / Web
  if (
    normalizedRole.includes('frontend') ||
    normalizedRole.includes('react') ||
    normalizedRole.includes('javascript') ||
    normalizedRole.includes('web')
  ) {
    return createFrontendPackage(role, experienceLevel, focusArea);
  }

  // Python / Data / Backend
  if (normalizedRole.includes('python') || normalizedRole.includes('django') || normalizedRole.includes('fastapi')) {
    return createPythonPackage(role, experienceLevel, focusArea);
  }

  // General Software Engineer / Full Stack
  return createGeneralPackage(role, experienceLevel, focusArea);
}

function createFrontendPackage(role: string, level: string, focus: string): InterviewPackage {
  const technicalQuestions: InterviewQuestion[] = [
    {
      id: 'tech-1',
      number: 1,
      type: 'technical',
      difficulty: 'Easy',
      category: 'JavaScript Core & Event Loop',
      question: 'Explain how the JavaScript Event Loop handles the Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout). What is the output order of asynchronous callbacks?',
      sampleAnswer: `JavaScript is single-threaded. Synchronous code runs immediately on the Call Stack. When an async operation completes, its callback enters either the Microtask Queue (Promises, queueMicrotask, MutationObserver) or the Macrotask Queue (setTimeout, setInterval, I/O). The Event Loop prioritizes the entire Microtask Queue to exhaustion after every single task before picking the next macrotask.`,
      followUpQuestions: [
        'What happens if a microtask continuously spawns another microtask?',
        'How does requestAnimationFrame fit into browser rendering frames relative to microtasks?'
      ],
      keyEvaluationPoints: ['Microtask vs macrotask priority', 'Single-threaded call stack execution', 'Async/await promise desugaring']
    },
    {
      id: 'tech-2',
      number: 2,
      type: 'technical',
      difficulty: 'Medium',
      category: 'React Internals & Reconciliation',
      question: 'How does React’s reconciliation algorithm and Fiber architecture work? Why are keys required in lists and what happens when array indexes are used as keys?',
      sampleAnswer: `React Fiber represents a virtual stack frame enabling cooperative scheduling and interruptible rendering. During reconciliation, React creates a new fiber tree (workInProgress) and diffs it with the current tree. Keys provide stable element identities across renders; using array indices causes component state to attach to the wrong DOM nodes when items are inserted, deleted, or reordered.`,
      followUpQuestions: [
        'What is the difference between rendering and committing in React 18+?',
        'How does Automatic Batching in React 18 improve render performance?'
      ],
      keyEvaluationPoints: ['Fiber tree diffing', 'Key stability requirement', 'State corruption prevention']
    },
    {
      id: 'tech-3',
      number: 3,
      type: 'technical',
      difficulty: 'Medium',
      category: 'Performance & Web Vitals',
      question: 'How do you optimize Core Web Vitals (LCP, INP, CLS) in a modern single-page application?',
      sampleAnswer: `1. **LCP (Largest Contentful Paint < 2.5s):** Preload hero images, use modern formats (AVIF/WebP), optimize server response times (TTFB), and eliminate render-blocking CSS/JS.
2. **INP (Interaction to Next Paint < 200ms):** Break long tasks using scheduler.yield() or startTransition, optimize event handlers, and avoid heavy DOM recalculations.
3. **CLS (Cumulative Layout Shift < 0.1):** Set explicit width/height on images/embeds, reserve layout space for dynamic ads/banners, and avoid inserting content above existing rendered items.`,
      followUpQuestions: [
        'What tools do you use to measure field metrics vs lab metrics?',
        'How does code-splitting with dynamic import() improve TBT and INP?'
      ],
      keyEvaluationPoints: ['Clear definition of LCP, INP, and CLS thresholds', 'Concrete architectural remedies for each metric']
    },
    {
      id: 'tech-4',
      number: 4,
      type: 'technical',
      difficulty: 'Medium',
      category: 'TypeScript & Type Safety',
      question: 'Explain TypeScript Generics, Conditional Types, and the difference between `interface` and `type` alias.',
      sampleAnswer: `Interfaces are extensible and support declaration merging, making them ideal for object models and public API contracts. Type aliases support union types, intersections, mapped types, and conditional types (e.g. T extends U ? X : Y). Generics allow creating reusable components with type preservation.`,
      followUpQuestions: [
        'How do `keyof` and `typeof` operators work in combination?',
        'What is type narrowing and how do user-defined type guards (is) work?'
      ],
      keyEvaluationPoints: ['Declaration merging awareness', 'Conditional type syntax', 'Union and utility type mastery']
    },
    {
      id: 'tech-5',
      number: 5,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Code Debugging & Error Diagnosis',
      question: `Code Debugging: What error occurs in this code snippet, why does it happen, and how do you fix it?

function UserProfile({ userId }: { userId: string }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch('/api/user/' + userId)
      .then(res => res.json())
      .then(json => setData(json));
  }, []);
  return <div>{data.name}</div>;
}`,
      sampleAnswer: `**Identified Errors:**
1. **Uncaught TypeError: Cannot read properties of null (reading 'name'):** On initial render, \`data\` is \`null\` while the async fetch is in flight. Attempting to access \`data.name\` crashes the app with a white screen.
   *Fix:* Guard rendering: \`if (!data) return <Skeleton />; return <div>{data.name}</div>;\` or optional chaining \`data?.name\`.
2. **Stale userId Bug:** The dependency array is \`[]\`, so when \`userId\` changes via parent props, the effect never re-fetches.
   *Fix:* Add \`userId\` to dependencies: \`[userId]\`.
3. **Race Condition & Memory Leak:** If \`userId\` changes rapidly, responses may arrive out of order.
   *Fix:* Use an \`AbortController\` in the cleanup function.`,
      followUpQuestions: [
        'How does React Query or SWR handle caching and race conditions out of the box?',
        'How do React Error Boundaries catch rendering errors in component trees?'
      ],
      keyEvaluationPoints: ['Immediate identification of null access on initial render', 'Dependency array omission identification', 'Network race condition cleanup']
    },
    {
      id: 'tech-6',
      number: 6,
      type: 'technical',
      difficulty: 'Medium',
      category: 'State Management & Architecture',
      question: 'Compare local state (useState/useReducer), Context API, and external stores (Zustand/Redux). When does Context cause unnecessary re-renders?',
      sampleAnswer: `Context is designed for low-frequency global updates (themes, auth state). When a Context provider value changes, every consumer component re-renders unless memoized or split into granular contexts. External stores like Zustand use subscription selectors, ensuring only components subscribed to changed slices re-render.`,
      followUpQuestions: [
        'How does selector pattern in Zustand prevent re-renders?',
        'When should server cache state be separated from client UI state?'
      ],
      keyEvaluationPoints: ['Context re-render mechanism understanding', 'Selector-based subscription benefits']
    },
    {
      id: 'tech-7',
      number: 7,
      type: 'technical',
      difficulty: 'Medium',
      category: 'CSS & Modern Layouts',
      question: 'Explain CSS Grid vs Flexbox, container queries, and how the browser layout engine calculates reflows and repaints.',
      sampleAnswer: `Flexbox is one-dimensional (row or column), best for content-driven linear components. CSS Grid is two-dimensional (simultaneous rows and columns), best for page layouts and strict alignments. Reflow (Layout) recalculates geometry of elements; Repaint redraws pixels. Using transform and opacity bypasses both to use GPU compositing.`,
      followUpQuestions: [
        'What triggers layout thrashing in JavaScript (e.g. reading offsetHeight in loops)?',
        'How do modern CSS container queries (@container) differ from media queries?'
      ],
      keyEvaluationPoints: ['1D vs 2D layout model distinction', 'GPU composite layer optimization']
    },
    {
      id: 'tech-8',
      number: 8,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Security & Web APIs',
      question: 'How do you protect a modern Single Page Application against XSS, CSRF, and clickjacking attacks?',
      sampleAnswer: `1. **XSS:** Sanitize all user inputs (DOMPurify), never use dangerouslySetInnerHTML with untrusted data, and enforce strict Content Security Policy (CSP) headers.
2. **CSRF:** Store auth tokens in HttpOnly, SameSite=Strict cookies; or use Bearer tokens in Authorization headers with anti-CSRF tokens for mutation requests.
3. **Clickjacking:** Send \`X-Frame-Options: DENY\` or CSP \`frame-ancestors 'none'\`.`,
      followUpQuestions: [
        'Why is localStorage vulnerable to token theft via XSS compared to HttpOnly cookies?',
        'What is Cross-Origin Resource Sharing (CORS) preflight request (OPTIONS)?'
      ],
      keyEvaluationPoints: ['CSP header configuration', 'SameSite cookie semantics', 'XSS vector sanitization']
    },
    {
      id: 'tech-9',
      number: 9,
      type: 'technical',
      difficulty: 'Hard',
      category: 'SSR & Hydration',
      question: 'Explain Server-Side Rendering (SSR) vs Static Site Generation (SSG). What causes React Hydration Mismatch errors and how do you resolve them?',
      sampleAnswer: `SSR renders HTML on every request; SSG pre-renders HTML at build time. Hydration mismatch occurs when the server-rendered HTML does not match the initial client-rendered virtual DOM tree (e.g. using Date.now(), window.innerWidth, or localStorage during render). Resolved by moving client-only logic into useEffect or using dynamic imports with ssr: false.`,
      followUpQuestions: [
        'What are React Server Components (RSC) and how do they differ from traditional SSR?',
        'What is progressive or selective hydration in React 18?'
      ],
      keyEvaluationPoints: ['Root causes of hydration mismatch errors', 'SSR vs SSG trade-offs']
    },
    {
      id: 'tech-10',
      number: 10,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Testing & Build Tooling',
      question: 'How do you structure an automated testing strategy (Unit, Integration, E2E) and optimize Vite / bundling build pipelines?',
      sampleAnswer: `Follow the Testing Trophy: heavy focus on integration tests using Vitest and React Testing Library testing user behaviors rather than implementation details. Use Playwright for critical E2E user journeys. In Vite, optimize builds via code splitting, manualChunks vendor grouping, tree-shaking dead code, and visual bundle inspection with rollup-plugin-visualizer.`,
      followUpQuestions: [
        'Why is testing implementation details (like component state directly) discouraged in RTL?',
        'How does esbuild speed up Vite dev server compared to traditional Webpack bundling?'
      ],
      keyEvaluationPoints: ['Integration test philosophy', 'Bundle optimization techniques']
    }
  ];

  const hrQuestions = createStandardHRQuestions();

  return {
    role,
    experienceLevel: level,
    focusArea: focus || 'Modern React, TypeScript, Core Web Vitals, and Web Architecture',
    totalTechnical: technicalQuestions.length,
    totalHR: hrQuestions.length,
    summary: `Complete interview suite for ${level} ${role} featuring 10 in-depth technical questions with error diagnostics and 5 STAR behavioral questions.`,
    technicalQuestions,
    hrQuestions,
    generatedAt: new Date().toISOString(),
    isAiGenerated: true,
  };
}

function createPythonPackage(role: string, level: string, focus: string): InterviewPackage {
  const technicalQuestions: InterviewQuestion[] = [
    {
      id: 'tech-1',
      number: 1,
      type: 'technical',
      difficulty: 'Easy',
      category: 'Core Python & Data Structures',
      question: 'Explain the difference between mutable and immutable types in Python. What is the danger of using a mutable default argument in a function?',
      sampleAnswer: `Immutable types (int, str, tuple, frozenset) cannot be modified after creation; mutable types (list, dict, set) can. When a mutable object (like a list []) is defined as a default parameter, it is evaluated once at function definition time. Subsequent calls modify the same shared object in memory across calls. Fix: use \`def fn(arg=None): if arg is None: arg = []\`.`,
      followUpQuestions: [
        'How does Python handle memory references with `is` vs `==`?',
        'Explain shallow copy vs deep copy with the `copy` module.'
      ],
      keyEvaluationPoints: ['Mutable default argument trap explanation', 'Memory reference comparison']
    },
    {
      id: 'tech-2',
      number: 2,
      type: 'technical',
      difficulty: 'Medium',
      category: 'Memory Management & GIL',
      question: 'What is the Global Interpreter Lock (GIL) in CPython, and how does Python manage memory via reference counting and cyclic garbage collection?',
      sampleAnswer: `The GIL is a mutex protecting access to Python objects, preventing multi-threaded CPython from executing bytecodes in parallel on multiple CPU cores. For CPU-bound tasks, multiprocessing or C extensions are needed. Memory is managed primarily by reference counting; when count hits 0, memory is freed immediately. A generational cyclic garbage collector runs periodically to detect circular references.`,
      followUpQuestions: [
        'What changes are introduced in Python 3.13 free-threaded mode (PEP 703)?',
        'How do weak references (`weakref`) help avoid circular reference memory leaks?'
      ],
      keyEvaluationPoints: ['GIL impact on CPU vs I/O bound workloads', 'Reference counting vs cyclic GC']
    },
    {
      id: 'tech-3',
      number: 3,
      type: 'technical',
      difficulty: 'Medium',
      category: 'AsyncIO & Concurrency',
      question: 'How does Python’s `asyncio` event loop work, and what happens when blocking code is executed inside an `async def` coroutine?',
      sampleAnswer: `asyncio uses a single-threaded cooperative event loop where coroutines yield control via \`await\`. If blocking code (e.g. \`time.sleep()\` or synchronous \`requests.get()\`) is called, it blocks the entire event loop, freezing all other pending tasks. Blocking calls must be offloaded using \`asyncio.to_thread()\` or \`loop.run_in_executor()\`.`,
      followUpQuestions: [
        'What is the difference between asyncio.gather() and asyncio.TaskGroup()?',
        'How do Python generators (`yield`) form the foundation of coroutines?'
      ],
      keyEvaluationPoints: ['Event loop cooperative multitasking principles', 'Prevention of event loop starvation']
    },
    {
      id: 'tech-4',
      number: 4,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Code Debugging & Error Exceptions',
      question: `Code Debugging: What error is raised by the following snippet, why does it happen, and how do you resolve it?

class Node:
    def __init__(self, val):
        self.val = val
        self.children = []

def process_tree(node):
    for child in node.children:
        if child.val < 0:
            node.children.remove(child)
        process_tree(child)`,
      sampleAnswer: `**Identified Bugs & Errors:**
1. **Skipped Elements & Unexpected Behavior:** Modifying a list (\`node.children.remove(child)\`) while iterating over it changes list indices dynamically, causing the iterator to skip subsequent elements.
2. **Infinite Recursion / RecursionError:** If the graph contains a cycle or self-reference, \`process_tree\` throws \`RecursionError: maximum recursion depth exceeded\`.
*Fixes:*
- Filter safely: \`node.children = [c for c in node.children if c.val >= 0]\`
- Keep a visited set to guard against circular graphs: \`visited = set()\`.`,
      followUpQuestions: [
        'How do you handle custom exception hierarchies in production Python applications?',
        'What are context managers (`__enter__` and `__exit__`) and how do they guarantee resource cleanup?'
      ],
      keyEvaluationPoints: ['List mutation during iteration bug diagnosis', 'Recursion depth limit awareness']
    },
    {
      id: 'tech-5',
      number: 5,
      type: 'technical',
      difficulty: 'Medium',
      category: 'Decorators & Metaprogramming',
      question: 'How do Python decorators work under the hood? Why is `@functools.wraps` necessary when writing custom decorators?',
      sampleAnswer: `A decorator is a higher-order function that takes a callable as input and returns a replacement callable. Without \`@functools.wraps(fn)\`, the wrapped function loses its original metadata (such as \`__name__\`, \`__doc__\`, and annotations), breaking introspection tools, documentation generators, and debugging stack traces.`,
      followUpQuestions: [
        'How do you write a decorator that accepts arguments (e.g. @retry(times=3))?',
        'What is the purpose of `__init_subclass__` and metaclasses?'
      ],
      keyEvaluationPoints: ['Closure and higher-order function mechanics', 'functools.wraps preservation']
    },
    {
      id: 'tech-6',
      number: 6,
      type: 'technical',
      difficulty: 'Medium',
      category: 'FastAPI / Django & REST APIs',
      question: 'Compare FastAPI (Pydantic, ASGI) and Django (MVT, WSGI). How does FastAPI achieve high throughput with async endpoints?',
      sampleAnswer: `FastAPI runs on ASGI servers (Uvicorn) with async support natively, validating request/response schemas via Pydantic type annotations with high performance. Django is a batteries-included framework with built-in ORM, admin, and authentication. FastAPI achieves high throughput by non-blocking I/O handling on concurrent requests.`,
      followUpQuestions: [
        'How does dependency injection work in FastAPI (`Depends`)?',
        'How do you prevent SQL injection in raw Django/SQLAlchemy queries?'
      ],
      keyEvaluationPoints: ['ASGI vs WSGI distinction', 'Pydantic data validation benefits']
    },
    {
      id: 'tech-7',
      number: 7,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Database & ORM Optimization',
      question: 'Explain the N+1 query problem in SQLAlchemy or Django ORM and how you resolve it using `select_related` vs `prefetch_related`.',
      sampleAnswer: `The N+1 problem occurs when fetching N records triggers N additional individual database queries to load related foreign key records. \`select_related\` performs an SQL JOIN in a single query (best for single-valued relationships like ForeignKey/OneToOne). \`prefetch_related\` executes a separate query with an IN clause (best for multi-valued ManyToMany or Reverse ForeignKey relations).`,
      followUpQuestions: [
        'How do database connection pooling engines (PgBouncer, SQLAlchemy Pool) improve backend scalability?',
        'How do you analyze slow queries using EXPLAIN ANALYZE in PostgreSQL?'
      ],
      keyEvaluationPoints: ['select_related JOIN vs prefetch_related IN distinction', 'Connection pooling familiarity']
    },
    {
      id: 'tech-8',
      number: 8,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Distributed Systems & Queues',
      question: 'How do you design asynchronous background task processing using Celery or Redis Queues (RQ)? How do you guarantee idempotency?',
      sampleAnswer: `Task queues offload long-running operations (email sending, report generation, video processing) from HTTP request cycles. Message brokers (Redis/RabbitMQ) hold tasks consumed by worker nodes. Idempotency is guaranteed by generating unique idempotency keys stored in Redis with atomic locks (\`SETNX\`) to prevent duplicate processing if tasks are retried after timeouts.`,
      followUpQuestions: [
        'What happens when a worker crashes mid-task, and how do visibility timeouts work?',
        'How do you implement dead-letter queues (DLQ) for failed task analysis?'
      ],
      keyEvaluationPoints: ['Idempotency key implementation', 'Broker architecture understanding']
    },
    {
      id: 'tech-9',
      number: 9,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Testing & Pytest',
      question: 'How do you structure integration testing in Python using `pytest`, fixtures (`yield`), and mocking (`unittest.mock`)?',
      sampleAnswer: `Use pytest fixtures with appropriate scopes (function, module, session). Fixtures using \`yield\` provide automatic setup before yield and teardown after. Use \`mock.patch\` or \`monkeypatch\` to stub external I/O (APIs, third-party services), while using testcontainers or SQLite in-memory for database integration tests.`,
      followUpQuestions: [
        'What is parameterized testing in pytest (`@pytest.mark.parametrize`)?',
        'Why should you avoid over-mocking internal methods in unit tests?'
      ],
      keyEvaluationPoints: ['Fixture lifecycle management', 'Effective mocking boundaries']
    },
    {
      id: 'tech-10',
      number: 10,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Profiling & Performance Optimization',
      question: 'How do you profile and diagnose CPU bottlenecks and memory leaks in a production Python service?',
      sampleAnswer: `Use sampling profilers like \`py-spy\` or \`cProfile\` to inspect CPU bottlenecks without stopping running processes. For memory analysis, use \`tracemalloc\` to track memory allocations by line of code, and inspect object reference cycles using the \`objgraph\` and \`gc\` modules. Look for unclosed database sessions and growing global dictionaries.`,
      followUpQuestions: [
        'What are the memory benefits of using `__slots__` in Python classes?',
        'How does Cython or PyPy achieve performance speedups for compute-intensive routines?'
      ],
      keyEvaluationPoints: ['Use of py-spy and tracemalloc', '__slots__ memory optimization']
    }
  ];

  const hrQuestions = createStandardHRQuestions();

  return {
    role,
    experienceLevel: level,
    focusArea: focus || 'Python, AsyncIO, Backend Architecture, and Distributed Systems',
    totalTechnical: technicalQuestions.length,
    totalHR: hrQuestions.length,
    summary: `Structured interview package for ${level} ${role} with 10 technical questions and 5 HR behavioral scenarios.`,
    technicalQuestions,
    hrQuestions,
    generatedAt: new Date().toISOString(),
    isAiGenerated: true,
  };
}

function createGeneralPackage(role: string, level: string, focus: string): InterviewPackage {
  const technicalQuestions: InterviewQuestion[] = [
    {
      id: 'tech-1',
      number: 1,
      type: 'technical',
      difficulty: 'Easy',
      category: 'Data Structures & Algorithmic Complexity',
      question: 'Explain the difference between Hash Tables and Balanced Binary Search Trees (e.g. Red-Black trees) in terms of time and space complexity for search, insert, and delete operations.',
      sampleAnswer: `Hash Tables offer O(1) average time complexity for lookup, insert, and delete, but degrade to O(N) in worst-case collisions and do not maintain sorted order. Balanced BSTs guarantee O(log N) worst-case time complexity and support range queries and in-order traversal.`,
      followUpQuestions: ['How do collision resolution strategies (Chaining vs Open Addressing) compare?', 'When would you pick a Tree over a Hash Table?'],
      keyEvaluationPoints: ['Big-O complexity accuracy', 'Worst-case vs average-case understanding']
    },
    {
      id: 'tech-2',
      number: 2,
      type: 'technical',
      difficulty: 'Medium',
      category: 'System Design & Scalability',
      question: 'How do you design a high-throughput URL shortening service (like Bitly)? Detail the hashing strategy, database choice, and caching layer.',
      sampleAnswer: `Use Base62 encoding on unique distributed counter IDs (via Redis atomic increments or Snowflake IDs) to generate 7-character URLs. Store mappings in a NoSQL database (DynamoDB/Cassandra) or PostgreSQL with index on the short code. Place a Redis cache in front with LRU eviction to serve the 20% most popular URLs directly from memory.`,
      followUpQuestions: ['How do you handle custom alias collision checks?', 'How do you handle analytics and click metrics without slowing down redirects?'],
      keyEvaluationPoints: ['Base62 encoding logic', 'Cache invalidation and LRU usage']
    },
    {
      id: 'tech-3',
      number: 3,
      type: 'technical',
      difficulty: 'Medium',
      category: 'Databases & ACID Properties',
      question: 'Explain the four ACID properties in relational databases. What is the difference between Optimistic and Pessimistic concurrency control?',
      sampleAnswer: `ACID stands for Atomicity (all-or-nothing), Consistency (integrity constraints preserved), Isolation (independent transactions), and Durability (committed data survives crashes). Pessimistic locking locks records on read (SELECT FOR UPDATE) to prevent concurrent writes. Optimistic locking verifies a version column before committing and aborts if the version changed.`,
      followUpQuestions: ['What are the 4 standard SQL isolation levels?', 'What is a Phantom Read?'],
      keyEvaluationPoints: ['ACID definition clarity', 'Optimistic versioning implementation']
    },
    {
      id: 'tech-4',
      number: 4,
      type: 'technical',
      difficulty: 'Medium',
      category: 'API Design & Protocols',
      question: 'Compare REST, GraphQL, and gRPC. In what scenarios would you choose gRPC over REST for microservices?',
      sampleAnswer: `REST is resource-oriented and ubiquitous for public APIs using standard HTTP methods. GraphQL allows clients to request exact fields, reducing over-fetching on mobile. gRPC uses HTTP/2 with binary Protocol Buffers (Protobuf), providing strongly-typed contracts, multiplexing, and low latency, making it ideal for high-throughput internal microservice communication.`,
      followUpQuestions: ['How does HTTP/2 multiplexing eliminate head-of-line blocking?', 'How do you version REST APIs in production?'],
      keyEvaluationPoints: ['Trade-offs across protocols', 'Binary Protobuf efficiency']
    },
    {
      id: 'tech-5',
      number: 5,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Code Debugging & Error Diagnostics',
      question: 'How do you diagnose and resolve a critical production issue where an API endpoint latency suddenly jumps from 50ms to 5,000ms with intermittent 504 Gateway Timeout errors?',
      sampleAnswer: `1. **Triage:** Check APM dashboards (Grafana/Datadog) to isolate whether the bottleneck is database queries, external third-party dependencies, or application thread contention.
2. **Database Check:** Look for unindexed queries, connection pool exhaustion, or table locks.
3. **Application Check:** Review thread dumps for lock contention, GC pause spikes, or unhandled retry storms.
4. **Mitigation:** Implement circuit breakers (Resilience4j), rate limiting, and increase connection pool limits while rolling out targeted index or query patches.`,
      followUpQuestions: ['What is the difference between 502 Bad Gateway and 504 Gateway Timeout?', 'How do distributed tracing tools (OpenTelemetry) trace requests across microservices?'],
      keyEvaluationPoints: ['Systematic triaging approach', 'Circuit breaker and connection pool awareness']
    },
    {
      id: 'tech-6',
      number: 6,
      type: 'technical',
      difficulty: 'Medium',
      category: 'Concurrency & Race Conditions',
      question: 'What is a race condition, and what techniques do you use to ensure thread safety in multi-threaded applications?',
      sampleAnswer: `A race condition occurs when multiple threads concurrently access and mutate shared state without synchronization, causing non-deterministic results. Techniques include: using immutable objects, atomic variables (Compare-And-Swap), explicit mutual exclusion locks (Mutex/ReentrantLock), thread-safe concurrent collections, or actor/message-passing models.`,
      followUpQuestions: ['What is a Deadlock and what are Coffman’s 4 conditions?', 'How does Compare-And-Swap (CAS) work at the hardware CPU level?'],
      keyEvaluationPoints: ['Race condition definition', 'CAS and atomic operations']
    },
    {
      id: 'tech-7',
      number: 7,
      type: 'technical',
      difficulty: 'Medium',
      category: 'CI/CD & DevOps Practices',
      question: 'Explain Blue-Green deployment vs Canary releases. How do automated CI/CD pipelines prevent broken code from hitting production?',
      sampleAnswer: `Blue-Green maintains two identical production environments; traffic is instantly switched from Blue to Green after validation, enabling instant rollbacks. Canary releases route a small percentage (e.g. 5%) of live traffic to the new version to monitor error rates and latency before full rollout. CI/CD pipelines enforce automated linting, unit tests, security vulnerability scanning, and integration tests before deployment.`,
      followUpQuestions: ['What is semantic versioning (SemVer)?', 'How do feature flags decouple deployment from release?'],
      keyEvaluationPoints: ['Blue-Green vs Canary trade-offs', 'Automated verification pipeline gates']
    },
    {
      id: 'tech-8',
      number: 8,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Security & Authentication',
      question: 'Explain OAuth 2.0 Authorization Code flow with PKCE. How does JSON Web Token (JWT) signature verification work?',
      sampleAnswer: `OAuth 2.0 with PKCE (Proof Key for Code Exchange) protects public clients against authorization code interception by using a cryptographically generated code_verifier and code_challenge. JWT consists of Header, Payload, and Signature. The recipient verifies the signature using the issuer public key (RS256) or shared secret (HS256) and verifies claims (exp, iss, aud).`,
      followUpQuestions: ['Why is token revocation challenging with stateless JWTs?', 'What is the purpose of Refresh Tokens?'],
      keyEvaluationPoints: ['PKCE security mechanism', 'JWT cryptographic signature verification']
    },
    {
      id: 'tech-9',
      number: 9,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Microservices & Event-Driven Systems',
      question: 'Compare Event-Driven Architecture (Apache Kafka, RabbitMQ) with synchronous REST architectures. How do you handle distributed transactions?',
      sampleAnswer: `Synchronous REST couples services in real-time, increasing latency and failure cascading. Event-driven systems decouple producers and consumers through persistent event logs (Kafka) or message queues. Distributed transactions across microservices are coordinated via the **Saga Pattern** (Choreography or Orchestration) using compensating actions, avoiding 2-Phase Commit (2PC) performance bottlenecks.`,
      followUpQuestions: ['What is the Outbox Pattern in event-driven systems?', 'What is the difference between at-least-once and exactly-once delivery?'],
      keyEvaluationPoints: ['Saga Pattern comprehension', 'Transactional Outbox pattern awareness']
    },
    {
      id: 'tech-10',
      number: 10,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Testing & Code Quality',
      question: 'What is Test-Driven Development (TDD), and how do you achieve meaningful code coverage without writing brittle unit tests?',
      sampleAnswer: `TDD follows Red-Green-Refactor: write failing test, write minimal code to pass, refactor with safety. To avoid brittle tests, test public API contracts and behaviors rather than internal private implementation details; avoid over-mocking collaborators; and complement unit tests with high-value integration tests that touch realistic boundaries.`,
      followUpQuestions: ['What is Mutation Testing and how does it evaluate test suite quality?', 'What are the trade-offs of 100% test coverage mandates?'],
      keyEvaluationPoints: ['Behavior-oriented testing focus', 'Over-mocking avoidance']
    }
  ];

  const hrQuestions = createStandardHRQuestions();

  return {
    role,
    experienceLevel: level,
    focusArea: focus || 'Core Architecture, Distributed Systems, Testing, and Reliability',
    totalTechnical: technicalQuestions.length,
    totalHR: hrQuestions.length,
    summary: `Comprehensive interview package for ${level} ${role}, including 10 technical questions and 5 HR behavioral scenarios.`,
    technicalQuestions,
    hrQuestions,
    generatedAt: new Date().toISOString(),
    isAiGenerated: true,
  };
}

function createStandardHRQuestions(): InterviewQuestion[] {
  return [
    {
      id: 'hr-1',
      number: 1,
      type: 'hr',
      difficulty: 'Medium',
      category: 'Conflict Resolution & Collaboration',
      question: 'Tell me about a time you had a significant technical disagreement with a teammate or lead. How did you handle it and what was the outcome?',
      sampleAnswer: `**Situation:** During a microservices refactoring project, a senior engineer advocated for synchronous REST calls while I recommended an asynchronous event-driven queue to prevent cascading timeouts.
**Task:** Align the engineering team on a resilient architecture without stalling the sprint deadline.
**Action:** I arranged a focused 30-minute whiteboard spike. Instead of arguing theoretical points, I created a quick benchmark demonstrating latency and failure propagation under 2x load. We also documented the trade-offs collaboratively in an Architecture Decision Record (ADR).
**Result:** The lead appreciated the data-driven approach and we agreed to adopt the event queue for high-volume transactions while keeping REST for simple metadata reads. The deployment had zero timeout incidents.`,
      followUpQuestions: [
        'How do you handle a scenario where you still disagree after data is presented?',
        'What role does an Architecture Decision Record (ADR) play in preserving team alignment?'
      ],
      keyEvaluationPoints: ['Data-driven conflict resolution', 'Respectful professional demeanor', 'Commitment to team velocity']
    },
    {
      id: 'hr-2',
      number: 2,
      type: 'hr',
      difficulty: 'Hard',
      category: 'Crisis Management & Production Outages',
      question: 'Describe a situation where code you wrote or deployed caused a production issue. How did you communicate and resolve it?',
      sampleAnswer: `**Situation:** After deploying a performance optimization, an unindexed database query caused connection pool exhaustion, resulting in 504 Gateway Timeouts for checkout requests.
**Task:** Restore checkout functionality immediately and communicate status to stakeholders.
**Action:** I immediately alerted the incident response Slack channel and assumed responsibility. I executed a 1-click rollback to the previous stable release within 4 minutes, mitigating user impact. Once systems were green, I gathered query execution metrics, added the missing compound index, validated it in staging, and wrote a blameless post-mortem with automated CI check action items.
**Result:** The incident was resolved with minimal downtime, and our new CI rule prevented future unindexed queries from merging.`,
      followUpQuestions: [
        'What is your philosophy on blameless post-mortems?',
        'How do you balance the pressure to deploy quickly with safety guardrails?'
      ],
      keyEvaluationPoints: ['Immediate ownership and transparency', 'Prioritizing customer recovery before root-cause analysis', 'Systemic preventive action items']
    },
    {
      id: 'hr-3',
      number: 3,
      type: 'hr',
      difficulty: 'Medium',
      category: 'Prioritization & Technical Debt',
      question: 'How do you balance delivering new business features against tackling accumulating technical debt and refactoring?',
      sampleAnswer: `**Situation:** Our team was pressured to deliver a quarterly feature release while experiencing frequent regressions due to legacy code with zero integration test coverage.
**Task:** Maintain feature delivery cadence while actively reducing technical debt risk.
**Action:** I proposed allocating 20% of each sprint capacity specifically to technical debt and refactoring. I framed technical debt in business terms to product managers—explaining how unaddressed bugs slowed down feature velocity. I spearheaded refactoring the most volatile modules first using the Boy Scout Rule (leaving code cleaner than we found it).
**Result:** Within two quarters, sprint bug churn decreased by 40% and our feature delivery speed improved significantly.`,
      followUpQuestions: [
        'How do you convince non-technical product managers that technical debt is worth addressing?',
        'How do you decide when to refactor vs when to completely rewrite a module?'
      ],
      keyEvaluationPoints: ['Translating technical debt into business value and velocity impact', 'Sustainable sprint capacity allocation']
    },
    {
      id: 'hr-4',
      number: 4,
      type: 'hr',
      difficulty: 'Easy',
      category: 'Mentorship & Knowledge Sharing',
      question: 'Can you share an example of how you mentored a junior engineer or helped onboard a new team member?',
      sampleAnswer: `**Situation:** A junior developer joined our team and struggled with our complex distributed microservices architecture and pull request review comments.
**Task:** Help the engineer build confidence and achieve independent productivity.
**Action:** I scheduled weekly 1-on-1 pairing sessions, created a streamlined local onboarding Docker environment with mock services, and practiced empathetic code reviews—explaining the "why" behind suggestions rather than just pointing out errors. I encouraged them to present a mini tech-talk to build their visibility.
**Result:** The engineer merged their first complex production feature within their first month and became the primary owner of that service within six months.`,
      followUpQuestions: [
        'How do you handle situations where a mentee makes the same mistake repeatedly?',
        'What makes code review feedback constructive rather than discouraging?'
      ],
      keyEvaluationPoints: ['Empathetic communication', 'Long-term investment in teammate autonomy']
    },
    {
      id: 'hr-5',
      number: 5,
      type: 'hr',
      difficulty: 'Medium',
      category: 'Adaptability & Learning',
      question: 'How do you stay up-to-date with evolving technologies, and how have you applied a newly learned technology or pattern to solve a real problem?',
      sampleAnswer: `**Situation:** Our backend services were struggling with memory overhead from thousands of blocked I/O threads waiting on external microservice responses.
**Task:** Explore modern lightweight concurrency models to improve throughput.
**Action:** Following the release of Java 21 Virtual Threads (Project Loom), I researched performance benchmarks, read JDK enhancement proposals (JEP 444), and built a prototype comparing traditional thread pools with Virtual Threads under high-concurrency loads.
**Result:** The prototype demonstrated a 65% reduction in memory consumption and 4x throughput increase. I shared the findings with our team, and we successfully adopted Virtual Threads for all I/O-bound services.`,
      followUpQuestions: [
        'How do you distinguish between hyped trends and genuinely useful production technologies?',
        'What technical blogs, podcasts, or open-source repositories do you regularly follow?'
      ],
      keyEvaluationPoints: ['Continuous learning habit', 'Pragmatic, prototype-driven technology adoption']
    }
  ];
}
