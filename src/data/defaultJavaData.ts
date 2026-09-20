import { InterviewPackage } from '../types';

export const defaultJavaInterviewData: InterviewPackage = {
  role: 'Java Developer',
  experienceLevel: 'Mid to Senior Level',
  focusArea: 'Core Java, Spring Boot, Concurrency & Microservices',
  totalTechnical: 10,
  totalHR: 5,
  summary: 'Curated 10 Technical Questions and 5 HR Questions tailored for a professional Java Developer role, complete with difficulty grading, comprehensive sample answers, and probing follow-up questions.',
  generatedAt: new Date().toISOString(),
  isAiGenerated: false,
  technicalQuestions: [
    {
      id: 'tech-1',
      number: 1,
      type: 'technical',
      difficulty: 'Medium',
      category: 'JVM & Memory Management',
      question: 'Explain the internal architecture of JVM memory. What is the difference between Heap, Stack, and Metaspace, and how does Garbage Collection (e.g., G1GC) reclaim memory?',
      sampleAnswer: `**JVM Memory Structure:**
1. **Stack Memory:** Allocated per thread. Stores method frames, local primitive variables, and references to objects on the heap. Fast, LIFO, automatically deallocated when a stack frame exits. Causes \`StackOverflowError\` if recursion is too deep.
2. **Heap Memory:** Shared across all threads. Stores all Java objects and instance arrays. Managed by Garbage Collection. Divided into Young Generation (Eden + Survivor S0/S1 spaces) and Old/Tenured Generation. Causes \`OutOfMemoryError: Java heap space\` when exhausted.
3. **Metaspace (since Java 8, replacing PermGen):** Off-heap native memory storing class metadata, method bytecode, runtime constant pools, and static variables. Managed dynamically by OS memory.

**Garbage Collection (G1GC):**
- G1 (Garbage-First) partitions the heap into equal-sized regional blocks (~1MB to 32MB) rather than contiguous young/old blocks.
- It concurrently marks regions and prioritizes sweeping regions containing the highest density of dead objects ("garbage first").
- Uses concurrent marking and incremental compaction to minimize Stop-The-World (STW) pause times while meeting a target latency threshold (\`-XX:MaxGCPauseMillis\`).`,
      followUpQuestions: [
        'How would you diagnose and fix a Metaspace OutOfMemoryError in a Spring Boot application?',
        'What are the advantages of modern ZGC or Shenandoah over G1GC for low-latency systems?',
        'Does passing an object reference to a method create a copy of the reference on the stack or modify the original reference directly?'
      ],
      keyEvaluationPoints: [
        'Clear distinction between thread-safe Stack vs shared Heap memory',
        'Understanding of Metaspace operating in native off-heap memory',
        'Awareness of Young Gen (Eden/Survivor) to Old Gen promotion'
      ]
    },
    {
      id: 'tech-2',
      number: 2,
      type: 'technical',
      difficulty: 'Medium',
      category: 'Java Collections Framework',
      question: 'How does HashMap work internally in Java 8+? What happens during a hash collision, and when does treeification occur?',
      sampleAnswer: `**Internal Mechanism of HashMap:**
- **Underlying Structure:** An array of \`Node<K, V>\` buckets (default initial capacity = 16, load factor = 0.75).
- **Index Calculation:** \`hash = (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16)\`. The index is obtained via bitwise masking: \`index = hash & (capacity - 1)\`.
- **Handling Collisions:**
  1. Prior to Java 8, colliding entries formed a linked list with linear search $O(n)$.
  2. In Java 8+, once a bucket's linked list reaches **TREEIFY_THRESHOLD = 8** AND total table capacity is at least **64**, the bucket converts into a **Red-Black Tree** (\`TreeNode\`).
  3. This improves worst-case lookup from $O(n)$ to $O(\\log n)$.
  4. If elements drop to **UNTREEIFY_THRESHOLD = 6** during resizing, the tree converts back to a linked list.
- **Resizing:** When \`size > capacity * loadFactor\`, capacity doubles ($2^n$), and elements are rehashed or shifted using the power-of-two mask bit.`,
      followUpQuestions: [
        'Why must you always override both `equals()` and `hashCode()` simultaneously when using custom keys?',
        'Why is `ConcurrentHashMap` preferred over `Collections.synchronizedMap()` or `Hashtable` for multi-threaded access?',
        'What happens if a mutable object used as a HashMap key changes its internal state after insertion?'
      ],
      keyEvaluationPoints: [
        'Mentioning the 8-node threshold for Red-Black tree conversion',
        'Understanding of the XOR shift hash spreading function',
        'Immutability requirement for keys in Hash-based collections'
      ]
    },
    {
      id: 'tech-3',
      number: 3,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Concurrency & Multithreading',
      question: 'Compare `synchronized`, `ReentrantLock`, and the `volatile` keyword. How do Java 21 Virtual Threads change high-throughput I/O-bound concurrency?',
      sampleAnswer: `**Comparison of Primitives:**
1. **\`volatile\`:** Guarantees **visibility** across CPU cores via memory barriers (happens-before relationship) and prevents instruction reordering. Does NOT guarantee atomicity (e.g., \`count++\` is still not thread-safe; use \`AtomicInteger\` instead).
2. **\`synchronized\`:** Intrinsic monitor lock. Implicitly releases lock upon exiting block/method or on exception. Supports JVM optimizations like lock elision and biased/lightweight locking.
3. **\`ReentrantLock\` (J.U.C):** Explicit lock offering timed lock attempts (\`tryLock()\`), interruptible locking, fairness policies, and multiple \`Condition\` objects for fine-grained wait/notify.

**Java 21 Virtual Threads (Project Loom):**
- Traditional OS threads are 1:1 kernel threads, heavy (~1MB stack), limited to a few thousands.
- **Virtual Threads** are lightweight user-mode threads managed by the JVM (running thousands or millions on a few Carrier OS threads).
- When a Virtual Thread hits blocking I/O (e.g., JDBC, HTTP socket), the JVM unmounts it from the carrier thread until the I/O completes.
- Eliminates the need for complex reactive programming (WebFlux/RxJava) while maintaining the simple synchronous request-per-thread model with massive throughput.`,
      followUpQuestions: [
        'What is thread pinning in Virtual Threads, and how does `synchronized` vs `ReentrantLock` affect it?',
        'What problem does the Double-Checked Locking pattern for singletons solve, and why is `volatile` required there?',
        'How does `CompletableFuture` differ from traditional `Future`?'
      ],
      keyEvaluationPoints: [
        'Volatile visibility vs atomicity distinction',
        'ReentrantLock capabilities over synchronized',
        'Deep understanding of Virtual Threads unmounting on blocking I/O'
      ]
    },
    {
      id: 'tech-4',
      number: 4,
      type: 'technical',
      difficulty: 'Easy',
      category: 'Java 8+ Modern Features',
      question: 'What is the Java Stream API? Differentiate between intermediate and terminal operations, and explain when you should NOT use parallel streams.',
      sampleAnswer: `**Java Stream API:**
A sequence of elements supporting functional-style pipeline operations (map, filter, reduce) without mutating the underlying data source.

**Intermediate vs Terminal Operations:**
- **Intermediate Operations:** Lazy evaluation. They return a new Stream and execute only when a terminal operation is invoked (e.g., \`filter()\`, \`map()\`, \`flatMap()\`, \`sorted()\`, \`distinct()\`).
- **Terminal Operations:** Trigger the pipeline execution and produce a final result or side-effect (e.g., \`collect()\`, \`forEach()\`, \`reduce()\`, \`count()\`, \`anyMatch()\`). A stream cannot be reused after a terminal operation.

**When NOT to use Parallel Streams (\`.parallelStream()\`):**
1. **I/O-bound tasks:** Parallel streams share the common \`ForkJoinPool.commonPool()\`. Blocking I/O starves other parallel operations across the entire application.
2. **Small collections:** Thread scheduling and splitting overhead exceed the benefits of parallel processing.
3. **Stateful / non-thread-safe lambdas:** Operations that access shared mutable state will yield race conditions.
4. **Operations sensitive to ordering:** Like \`findFirst()\` on ordered streams where splitting and recombining is expensive.`,
      followUpQuestions: [
        'What is the difference between `map()` and `flatMap()` with a practical example?',
        'How does lazy evaluation in streams optimize execution (e.g., short-circuiting)?',
        'What is an `Optional` and what are common anti-patterns when using it?'
      ],
      keyEvaluationPoints: [
        'Lazy evaluation concept for intermediate operations',
        'One-time consumption rule for streams',
        'Awareness of common ForkJoinPool contention with parallel streams'
      ]
    },
    {
      id: 'tech-5',
      number: 5,
      type: 'technical',
      difficulty: 'Medium',
      category: 'Code Debugging & Error Codes',
      question: `Code Debugging & Error Diagnosis: What runtime error or exception is thrown by each of the following code snippets, why does it occur, and how do you fix it?

// Snippet A:
List<String> items = new ArrayList<>(List.of("Apple", "Banana", "Cherry"));
for (String item : items) {
    if ("Banana".equals(item)) {
        items.remove(item);
    }
}

// Snippet B:
Object val = Integer.valueOf(100);
String str = (String) val;`,
      sampleAnswer: `**Diagnosis of Snippet A (Error Code: ConcurrentModificationException):**
- **Error Thrown:** \`java.util.ConcurrentModificationException\`.
- **Root Cause:** The enhanced \`for-each\` loop compiles into an internal \`Iterator\`. When \`items.remove(item)\` is invoked directly on the \`ArrayList\` rather than on the iterator, the list's internal structural modification counter (\`modCount\`) increments. On the next \`iterator.next()\` call, \`expectedModCount != modCount\`, triggering the fail-fast exception.
- **Fix 1 (Modern Java 8+):** \`items.removeIf("Banana"::equals);\`
- **Fix 2 (Explicit Iterator):**
\`\`\`java
Iterator<String> it = items.iterator();
while (it.hasNext()) {
    if ("Banana".equals(it.next())) {
        it.remove(); // Safely updates expectedModCount
    }
}
\`\`\`

**Diagnosis of Snippet B (Error Code: ClassCastException):**
- **Error Thrown:** \`java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String\`.
- **Root Cause:** Downcasting between unrelated object types in the hierarchy is illegal at runtime even though the compiler allows it via the \`Object\` reference.
- **Fix:** Use \`String.valueOf(val)\` or check with pattern matching:
\`\`\`java
if (val instanceof String s) {
    // safe use of s
} else {
    String s = String.valueOf(val);
}
\`\`\`

**Production Error Handling Best Practice:**
- In Spring Boot REST APIs, never leak raw stack traces or internal 500 error codes. Use \`@ControllerAdvice\` with RFC 7807 / RFC 9457 \`ProblemDetail\` to map exceptions to explicit HTTP status codes (e.g. 400 Bad Request, 404 Not Found, 409 Conflict).`,
      followUpQuestions: [
        'How does `CopyOnWriteArrayList` prevent `ConcurrentModificationException`, and what is the trade-off with write latency?',
        'How do you design a global exception handler in Spring Boot using `@RestControllerAdvice` and `ProblemDetail`?',
        'What is the difference between `Error` (e.g., `OutOfMemoryError`) and `Exception` (e.g., `IOException`) in Java?'
      ],
      keyEvaluationPoints: [
        'Correctly identifying ConcurrentModificationException and the iterator modCount mismatch',
        'Demonstrating modern removeIf or iterator.remove() solution',
        'Understanding RFC 7807 ProblemDetail REST error response standard'
      ]
    },
    {
      id: 'tech-6',
      number: 6,
      type: 'technical',
      difficulty: 'Medium',
      category: 'Spring Boot & IoC Container',
      question: 'How does Spring Boot’s Inversion of Control (IoC) and Dependency Injection (DI) container work? Explain Bean scopes and how Spring resolves circular dependencies.',
      sampleAnswer: `**Spring IoC & DI:**
- **IoC Container (\`ApplicationContext\`):** Responsible for instantiating, configuring, and assembling beans based on annotations (\`@Component\`, \`@Service\`, \`@Bean\`) or configuration classes.
- **Dependency Injection:** Done via Constructor injection (recommended for immutability & testing), Setter injection, or Field injection (\`@Autowired\`).

**Bean Scopes:**
1. **\`singleton\` (default):** One instance per Spring IoC container.
2. **\`prototype\`:** New instance created each time the bean is requested.
3. **Web Scopes:** \`request\` (one per HTTP request), \`session\` (one per HTTP session), \`application\` (one per ServletContext).

**Circular Dependency Resolution:**
- Occurs when Bean A depends on Bean B, and Bean B depends on Bean A.
- Spring resolves circular dependencies for **singleton beans using setter/field injection** through a **3-level cache** (\`singletonObjects\`, \`earlySingletonObjects\`, \`singletonFactories\`). Bean A is exposed as a raw early reference before full initialization.
- **Constructor injection circular dependencies cannot be resolved automatically** and throw \`BeanCurrentlyInCreationException\`.
- **Fixes:** Refactor design (break cyclic coupling), use \`@Lazy\` injection, or use event-driven listeners (\`ApplicationEventPublisher\`).`,
      followUpQuestions: [
        'Why is constructor injection strongly favored over `@Autowired` field injection?',
        'What happens when a singleton bean injects a prototype bean, and how do you resolve the prototype lifecycle mismatch?',
        'What is the sequence of the Spring Bean lifecycle (BeanPostProcessor, @PostConstruct, InitializingBean)?'
      ],
      keyEvaluationPoints: [
        'Constructor injection advocacy for testability and immutability',
        'Knowledge of singleton vs prototype scope behaviors',
        'Explanation of the three-level cache mechanism for circular dependencies'
      ]
    },
    {
      id: 'tech-7',
      number: 7,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Spring & Transaction Management',
      question: 'How does Spring’s `@Transactional` annotation work under the hood? Explain transaction propagation types and why self-invocation breaks transactionality.',
      sampleAnswer: `**Under the Hood Mechanism:**
- Spring uses **AOP Dynamic Proxies** (CGLIB for classes, JDK dynamic proxy for interfaces).
- When a method annotated with \`@Transactional\` is called from an external class, the proxy intercepts the call, invokes \`PlatformTransactionManager.getTransaction()\`, opens a database connection, starts the transaction, runs the target method, and commits or rolls back on exception.
- By default, rollback only triggers for **unchecked exceptions** (\`RuntimeException\` and \`Error\`). To rollback on checked exceptions, declare \`@Transactional(rollbackFor = Exception.class)\`.

**Key Propagation Types:**
1. **\`REQUIRED\` (default):** Joins existing transaction if present; creates new one if none exists.
2. **\`REQUIRES_NEW\`:** Always suspends the existing transaction and starts a completely independent new transaction.
3. **\`MANDATORY\`:** Requires an active transaction; throws exception if none exists.
4. **\`SUPPORTS\`:** Runs in transaction if caller has one; runs non-transactionally otherwise.

**The Self-Invocation Trap:**
- If method \`A()\` calls method \`B()\` with \`@Transactional\` inside the **same class** (\`this.B()\`), the call bypasses the Spring proxy and directly invokes the local method.
- **Result:** No transaction is initiated for \`B()\`.
- **Solution:** Inject the self-bean using \`@Lazy\`, move method \`B()\` into a separate service, or use programmatic \`TransactionTemplate\`.`,
      followUpQuestions: [
        'What is the difference between `@Transactional(readOnly = true)` and standard read-write transactions in terms of Hibernate dirty checking?',
        'What happens when a child transaction with `REQUIRES_NEW` fails versus an inner `REQUIRED` transaction failure?',
        'How does database isolation level (e.g., READ_COMMITTED vs REPEATABLE_READ) relate to Spring transaction declarations?'
      ],
      keyEvaluationPoints: [
        'AOP proxy interception explanation',
        'Self-invocation proxy bypass awareness',
        'Rollback rules on unchecked vs checked exceptions'
      ]
    },
    {
      id: 'tech-8',
      number: 8,
      type: 'technical',
      difficulty: 'Hard',
      category: 'Performance Tuning & Diagnostics',
      question: 'How do you detect, analyze, and resolve a memory leak or CPU spike in a production Java application?',
      sampleAnswer: `**Step-by-Step Diagnostic Process:**

1. **Detection & Metric Monitoring:**
   - Detect via APM tools (Datadog, Prometheus/Grafana, New Relic) tracking JVM Heap usage, GC pause frequency, and thread states.
   - Configure JVM flags: \`-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps/heap.hprof\`.

2. **CPU Spike Investigation:**
   - Run \`top -H -p <pid>\` to identify the specific OS thread ID consuming high CPU.
   - Convert thread ID from decimal to hexadecimal (\`printf "%x\\n" <tid>\`).
   - Take a thread dump: \`jcmd <pid> Thread.print\` or \`jstack <pid>\`.
   - Grep for the hex thread ID to pinpoint the exact line of code (e.g., infinite loop, excessive regex backtracking, lock spin).

3. **Memory Leak Investigation:**
   - Capture a live heap dump using \`jcmd <pid> GC.heap_dump /tmp/dump.hprof\`.
   - Analyze using Eclipse Memory Analyzer Tool (MAT) or JProfiler.
   - Inspect the "Leak Suspects" report and review the Dominator Tree.
   - Look for objects with large retained sizes held by GC Roots.
   - **Common Leak Culprits:** Static collections accumulating data without eviction, unclosed \`ThreadLocal\` references in thread pools, unclosed streams/connections, or third-party listeners that were never unregistered.`,
      followUpQuestions: [
        'Why are `ThreadLocal` variables particularly prone to memory leaks in web servers like Tomcat/Undertow?',
        'What is the difference between shallow heap and retained heap size in memory analyzers?',
        'How does CPU throttling in Kubernetes containers manifest inside JVM metrics, and how does `-XX:ActiveProcessorCount` help?'
      ],
      keyEvaluationPoints: [
        'Command-line tooling knowledge (jcmd, jstack, jmap, top -H)',
        'Understanding GC Roots and retained heap size in MAT',
        'Recognition of ThreadLocal leaks in application server thread pools'
      ]
    },
    {
      id: 'tech-9',
      number: 9,
      type: 'technical',
      difficulty: 'Medium',
      category: 'JPA & Database Optimization',
      question: 'What is the N+1 select problem in Hibernate/JPA? What are three distinct ways to solve it?',
      sampleAnswer: `**The N+1 Problem:**
Occurs when an application executes 1 query to fetch $N$ parent entities, and then executes $N$ additional queries to fetch the associated child entity for each parent (e.g., fetching 50 Orders triggers 1 select for orders + 50 individual selects for Customer).

**Three Distinct Solutions:**

1. **JPQL / HQL with \`JOIN FETCH\`:**
   \`\`\`java
   @Query("SELECT o FROM Order o JOIN FETCH o.customer WHERE o.status = :status")
   List<Order> findAllWithCustomer(@Param("status") Status status);
   \`\`\`
   Forces a single SQL \`INNER JOIN\` or \`LEFT JOIN\`, pulling parent and child in one query roundtrip.

2. **JPA Entity Graphs (\`@EntityGraph\`):**
   \`\`\`java
   @EntityGraph(attributePaths = {"customer", "items"})
   List<Order> findByStatus(Status status);
   \`\`\`
   Declaratively overrides fetch plans at runtime without rewriting complex queries.

3. **Batch Fetching (\`@BatchSize\`):**
   \`\`\`java
   @BatchSize(size = 25)
   @OneToMany(mappedBy = "order")
   private List<OrderItem> items;
   \`\`\`
   Hibernate groups sub-queries using SQL \`IN (?, ?, ...)\`, reducing $N+1$ queries down to $1 + \\lceil N / 25 \\rceil$ queries.`,
      followUpQuestions: [
        'Why should you avoid using `FetchType.EAGER` in JPA entity definitions?',
        'What happens if you use `JOIN FETCH` on multiple `@OneToMany` collection relationships simultaneously (Cartesian product problem)?',
        'How does Spring Data JPA’s projection interface improve query performance over loading entire managed entities?'
      ],
      keyEvaluationPoints: [
        'Accurate explanation of the query proliferation cause',
        'Providing JOIN FETCH, EntityGraph, and BatchSize as distinct solutions',
        'Understanding Cartesian product hazards with multiple collection joins'
      ]
    },
    {
      id: 'tech-10',
      number: 10,
      type: 'technical',
      difficulty: 'Senior',
      category: 'Microservices & Distributed Systems',
      question: 'How do you design for resilience in a Java microservices architecture? Explain how the Circuit Breaker pattern (e.g., Resilience4j) prevents cascading failures.',
      sampleAnswer: `**Resilience in Microservices:**
In distributed systems, failures are inevitable. Designing for resilience means containing failures locally to prevent total system outages.

**Key Resilience Patterns:**
1. **Circuit Breaker (Resilience4j):**
   - Tracks call failure rate over a sliding window (count-based or time-based).
   - **CLOSED State:** Normal operation; requests pass through.
   - **OPEN State:** When failure threshold (e.g., 50% errors or timeouts) is exceeded, the breaker trips to OPEN. All incoming requests immediately fail fast or execute a fallback method without stressing the downstream service.
   - **HALF-OPEN State:** After a configured wait duration, a trial batch of requests is allowed through. If successful, it transitions back to CLOSED; if failures persist, it reverts to OPEN.
2. **Rate Limiting & Bulkheading:** Isolates resources (thread pools or semaphores) so that a slow downstream dependency does not consume all threads of the calling service.
3. **Retry with Exponential Backoff & Jitter:** Retries transient failures (HTTP 503, connection reset) while avoiding the "thundering herd" problem by adding random jitter.
4. **Idempotency:** Ensures duplicate network retries do not cause duplicate state mutations (using unique idempotency keys).`,
      followUpQuestions: [
        'How does Resilience4j integrate with Spring Boot Actuator and Micrometer for alerting metrics?',
        'What is the difference between thread-pool bulkheading and semaphore bulkheading in Resilience4j?',
        'How do you maintain distributed transaction consistency without two-phase commit (e.g., the Saga pattern)?'
      ],
      keyEvaluationPoints: [
        'Three states of Circuit Breaker (Closed, Open, Half-Open)',
        'Understanding fail-fast and fallback strategies',
        'Awareness of Bulkheading and Exponential Backoff with Jitter'
      ]
    }
  ],
  hrQuestions: [
    {
      id: 'hr-1',
      number: 1,
      type: 'hr',
      difficulty: 'Medium',
      category: 'Conflict Resolution & Collaboration',
      question: 'Tell me about a time you had a technical disagreement with a teammate or senior engineer. How did you resolve it?',
      sampleAnswer: `**STAR Framework Response:**

- **Situation:** In my previous role, our team was redesigning a high-throughput event processing pipeline. A senior engineer advocated for an asynchronous reactive stack (Spring WebFlux), while I proposed standard Spring Boot with Java Virtual Threads and structured concurrency.
- **Task:** As the lead implementer for the module, I needed to ensure we met our latency SLA while keeping the codebase maintainable for our 8-person team, most of whom had standard imperative Java experience.
- **Action:** Instead of arguing theoretically, I arranged an objective spike. I created a benchmark repository replicating our production workload (10,000 concurrent socket connections). I demonstrated that Virtual Threads delivered comparable throughput with significantly simpler debugging, stack traces, and test coverage. I also listened to his concerns regarding reactive backpressure and showed how we could achieve backpressure using bounded queues.
- **Result:** The senior engineer agreed with the data-driven proposal. We delivered the project two weeks ahead of schedule with zero production regressions, and our team onboarding time dropped drastically because junior engineers didn't have to learn reactive operators.`,
      followUpQuestions: [
        'What would you have done if the team lead still insisted on WebFlux despite your benchmark results?',
        'How do you prevent technical disagreements from affecting day-to-day team morale?'
      ],
      keyEvaluationPoints: [
        'Data-driven, respectful resolution rather than emotional stubbornness',
        'Empathy for team maintainability and onboarding',
        'Structured STAR presentation with tangible outcome'
      ]
    },
    {
      id: 'hr-2',
      number: 2,
      type: 'hr',
      difficulty: 'Hard',
      category: 'Crisis Management & Ownership',
      question: 'Describe a complex production outage or severe bug you encountered. How did you communicate with stakeholders and resolve the incident?',
      sampleAnswer: `**STAR Framework Response:**

- **Situation:** On a Friday afternoon right after a release, our core payment authorization service experienced an exponential spike in response latency from 150ms to 12 seconds, causing connection pool exhaustion and checkout failures.
- **Task:** As the engineer on-call, my primary duty was to restore customer service immediately, communicate transparently with our support and product teams, and isolate the root cause without panic.
- **Action:**
  1. *Immediate Mitigation:* I initiated an immediate rollback of the latest deployment to return customer traffic to the stable baseline within 6 minutes.
  2. *Communication:* I posted an incident status update to the cross-functional stakeholder channel with an estimated resolution timeline, customer impact scope, and temporary workaround.
  3. *Root-Cause Analysis:* Post-restoration, I analyzed thread dumps and APM metrics. A database index had been inadvertently dropped during the schema migration script, turning an indexed user lookup into a full table scan under high concurrent load.
  4. *Permanent Fix:* We re-applied the index, added an automated migration validation gate in our CI/CD pipeline, and wrote a blameless post-mortem report shared with engineering leadership.
- **Result:** Service was restored within 8 minutes of detection. Our new CI/CD migration check prevented similar database schema anomalies in subsequent quarters.`,
      followUpQuestions: [
        'How do you decide between fixing forward versus rolling back during an active production crisis?',
        'What makes a blameless post-mortem culture effective in an engineering organization?'
      ],
      keyEvaluationPoints: [
        'Prioritizing customer restoration over immediate root-cause investigation',
        'Clear, proactive communication with non-technical stakeholders',
        'Blameless culture and systemic automated prevention'
      ]
    },
    {
      id: 'hr-3',
      number: 3,
      type: 'hr',
      difficulty: 'Easy',
      category: 'Continuous Learning & Adaptability',
      question: 'How do you stay current with rapidly evolving Java versions, frameworks, and modern software engineering practices?',
      sampleAnswer: `**Structured Response:**

1. **Primary Sources & JDK Enhancements:**
   - I regularly track JDK Enhancement Proposals (JEPs) through OpenJDK and the Inside Java podcast/newsletter led by Oracle's Java Developer Relations team.
   - When LTS versions are released (e.g., Java 17 to Java 21), I build hands-on prototype repositories to test new language features (like Pattern Matching, Sealed Classes, Record Patterns, and Virtual Threads).

2. **Community & Architecture Blogs:**
   - I follow trusted architectural blogs like InfoQ, Martin Fowler, Baeldung, and Spring Blog for release notes and framework migrations (e.g., Spring Boot 3 / Jakarta EE baseline).
   - I actively participate in local Java User Groups (JUG) and technical discussion forums.

3. **Practical Application at Work:**
   - Learning is most valuable when shared. Whenever our team evaluates an upgrade or library, I prepare short internal brown-bag sessions and prototype proof-of-concepts, detailing migration hurdles and performance gains.`,
      followUpQuestions: [
        'What is your favorite new feature introduced between Java 17 and Java 21, and why?',
        'How do you convince management to invest in upgrading a legacy Java 8 or 11 monolith to a modern LTS release?'
      ],
      keyEvaluationPoints: [
        'Genuine curiosity and structured learning habits',
        'Experience experimenting with new JDK features in practice',
        'Sharing knowledge with peers to uplift team capability'
      ]
    },
    {
      id: 'hr-4',
      number: 4,
      type: 'hr',
      difficulty: 'Medium',
      category: 'Prioritization & Technical Debt',
      question: 'Tell me about a project where deadlines were tight and requirements kept shifting. How did you prioritize technical debt versus delivery?',
      sampleAnswer: `**STAR Framework Response:**

- **Situation:** Six weeks before a mandatory regulatory deadline for a banking client, product requirements shifted to support three additional payment providers with different API contracts.
- **Task:** Delivering all features with full perfection was mathematically impossible without either burning out the team or shipping brittle, untested code that could cause compliance audits to fail.
- **Action:**
  1. I led a triage session with the Product Manager and Engineering Manager. We mapped requirements on an Impact vs. Effort matrix to define our strict "Must-Have" MVP.
  2. We architected a clean Strategy Pattern interface for the payment providers, implementing the core two providers natively while creating a deliberate, documented technical debt item for the third edge-case provider.
  3. Rather than silently cutting corners, we explicitly logged the technical debt in Jira with an agreed refactoring sprint scheduled directly following the launch.
- **Result:** We passed the compliance audit on the target launch date with 100% test coverage on our core flows. In the subsequent sprint, we paid down the logged technical debt, successfully integrating the remaining provider without architectural disruption.`,
      followUpQuestions: [
        'How do you explain technical debt to non-technical business leaders who only care about feature delivery?',
        'When is it acceptable to take on intentional technical debt?'
      ],
      keyEvaluationPoints: [
        'Ability to collaborate with Product Managers on trade-offs',
        'Making technical debt explicit, quantified, and scheduled rather than hidden',
        'Protecting code quality and test discipline under pressure'
      ]
    },
    {
      id: 'hr-5',
      number: 5,
      type: 'hr',
      difficulty: 'Easy',
      category: 'Motivation & Career Vision',
      question: 'Why are you interested in this Java Developer role, and where do you envision your engineering career in the next 3 to 5 years?',
      sampleAnswer: `**Structured Response:**

- **Why this role:**
  - I am passionate about backend distributed systems and enterprise-scale reliability. This role provides the opportunity to work on mission-critical, high-throughput architectures where low latency, concurrency, and clean domain-driven design truly matter.
  - From researching your engineering culture, I appreciate your emphasis on code quality, automated testing, and adopting modern Java standards.

- **3 to 5 Year Career Vision:**
  - Over the next 1–2 years, I aim to master your domain, contribute to high-impact core services, and establish myself as a reliable, go-to engineer for complex Java and Spring architectural problems.
  - In 3–5 years, my goal is to progress into a Senior/Staff Engineer or Technical Lead role. I want to drive broader system architecture decisions, mentor junior and mid-level developers, and help shape best practices across cross-functional engineering teams.`,
      followUpQuestions: [
        'What kind of engineering culture brings out the best in you?',
        'Do you lean more toward hands-on architectural leadership or engineering management, and why?'
      ],
      keyEvaluationPoints: [
        'Specific alignment with the technical domain of the role',
        'Clear, realistic progression timeline balancing execution and mentorship',
        'Self-awareness and positive professional ambition'
      ]
    }
  ]
};
