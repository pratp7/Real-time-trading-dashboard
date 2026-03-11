Real Time Trading Dashboard
High level Design
Requirements -
![requirements](requirements.png)

Hight Level Architecture
![architecture](architecture.png)

### Trade-offs: Ticker List Rendering

There are two main approaches to rendering the ticker list with live pricing:

1. **FE merges REST + WS**
   - **REST** provides static metadata (symbol, name, type).
   - **WS** provides live price updates.
   - **Pros:** Simpler backend, flexible FE control.
   - **Cons:** More FE complexity, risk of mismatched timing if merging is not handled carefully.

2. **Unified BE feed (REST + WS combined)**
   - Backend merges static metadata with live prices.
   - FE subscribes to a single WS channel for unified payloads.
   - **Pros:** Simplifies FE logic, ensures consistency, easier scaling.
   - **Cons:** More backend complexity, BE must decide between sending full payloads or deltas.

**Best practice:** Use a hybrid model — initial snapshot (full payload) followed by delta updates — to balance efficiency and simplicity.

### Trade-offs: Subscription Lifecycle

For ticker list vs. chart views, there are two approaches:

- **Keep list feed active in background**
  - Pros: Faster navigation back, no resubscribe overhead.
  - Cons: Higher bandwidth and resource usage.

- **Unsubscribe when leaving list page**
  - Pros: Saves bandwidth and server load, cleaner state.
  - Cons: Requires resubscribe handshake when returning, slight delay.

**Best practice:** Use one WS connection with multiple channels. Subscribe/unsubscribe dynamically based on page context (list vs. chart), balancing resource efficiency with user experience.
