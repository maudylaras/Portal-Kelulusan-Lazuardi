# Security Specifications - Portal Pelulusan Lazuardi

## Data Invariants
1. **User Identity Invariant**: A user's profile inside `users/{userId}` can only be initialized or updated if the authenticated user's UID matches `{userId}`.
2. **Role Immortality & Protection**: Normal users cannot self-assign or elevate their role to `"admin"`. If is already `"admin"`, it cannot be changed back to `"user"` except by an authorized process.
3. **Admin Privilege Isolation**: Only users with the `"admin"` role in Firestore are allowed to perform write operations (create, update, delete, write) on `batches/{batchId}`.
4. **Read Access For All Signed-In Employees**: Any authenticated user can read batch documents to query or list their training status.
5. **No Anonymous Writing**: Users must be authenticated through Google Auth with a verified email to conduct any writes.

## The Dirty Dozen Payloads

### 1-4: Identity & Profile Spoofing Attacks on `users/{userId}`
- **Payload 1**: User `Bob` tries to create/overwrite `users/Alice`'s profile.
- **Payload 2**: Unauthorized or anonymous client attempts to perform write on `users/*` path.
- **Payload 3**: Newly registering user tries to register with `"role": "admin"` to gain instant administrator access.
- **Payload 4**: Authenticated user tries to update their own role from `"user"` to `"admin"`.

### 5-8: State Overwrites & Privilege Escalation on `users/{userId}`
- **Payload 5**: Non-admin user tries to overwrite an existing admin user's document to demote/promote roles.
- **Payload 6**: Malicious user attempts to inject large, non-string keys or excessive string length into `name` or `emailLower`.
- **Payload 7**: Malicious client attempts to update `status` to an invalid enumerator state.
- **Payload 8**: User attempts to update `createdAt` or other immutable fields during subsequent login updates.

### 9-12: Integrity Violation on `batches/{batchId}`
- **Payload 9**: Authenticated reader (`role: "user"`) tries to write/insert a new batch in `batches/batch-x`.
- **Payload 10**: Authenticated reader (`role: "user"`) tries to delete `batches/batch-1`.
- **Payload 11**: Authenticated reader (`role: "user"`) tries to update participants or change graduation status of are training inside a batch.
- **Payload 12**: Malicious client injects arbitrary oversized fields inside `batches/{batchId}`.

## Security Rules Test Setup
A test runner would emulate auth contexts and ensure Firestore rejects all 12 malicious payloads with a `PERMISSION_DENIED` status. Only safe, validated documents are signed off by the security engine.
