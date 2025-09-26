# 🗄️ MongoDB Models for Trello Clone

> Tài liệu này chuyển đổi thiết kế cơ sở dữ liệu PostgreSQL trong `database-models.md` sang mô hình cơ sở dữ liệu MongoDB (sử dụng Mongoose ODM). Mục tiêu là giữ nguyên cấu trúc domain và các ràng buộc nghiệp vụ, đồng thời tận dụng ưu điểm linh hoạt của MongoDB.

---

## 📋 1. Core Collections (Entity chính)

### 1.1 `users`
```ts
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, maxlength: 50, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, maxlength: 100 },
    avatarUrl: { type: String },
    initials: {
      type: String,
      required: true,
      maxlength: 2,
      default: function () {
        const parts = this.fullName.trim().split(/\s+/);
        return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
      },
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ isActive: 1 });
```

### 1.2 `workspaces`
```ts
const WorkspaceSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 255 },
    description: { type: String },
    type: { type: String, enum: ['personal', 'team', 'enterprise'], default: 'personal' },
    visibility: { type: String, enum: ['private', 'public'], default: 'private' },
    createdBy: { type: ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

WorkspaceSchema.index({ createdBy: 1 });
WorkspaceSchema.index({ visibility: 1 });
```

### 1.3 `boards`
```ts
const BoardSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 255 },
    description: { type: String },
    background: {
      type: {
        type: String,
        enum: ['color', 'gradient', 'image'],
        default: 'gradient',
      },
      value: {
        type: String,
        default: 'linear-gradient(135deg, #026AA7 0%, #4A90C2 50%, #5AAC44 100%)',
      },
    },
    visibility: { type: String, enum: ['private', 'workspace', 'public'], default: 'private' },
    isClosed: { type: Boolean, default: false },
    createdBy: { type: ObjectId, ref: 'User', required: true },
    workspaceId: { type: ObjectId, ref: 'Workspace' },
  },
  { timestamps: true }
);

BoardSchema.index({ createdBy: 1 });
BoardSchema.index({ workspaceId: 1 });
BoardSchema.index({ visibility: 1, isClosed: 1 });
```

### 1.4 `columns`
```ts
const ColumnSchema = new Schema(
  {
    boardId: { type: ObjectId, ref: 'Board', required: true },
    title: { type: String, required: true, maxlength: 255 },
    position: { type: Number, required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ColumnSchema.index({ boardId: 1, position: 1 }, { unique: true });
ColumnSchema.index({ boardId: 1, isArchived: 1 });
```

### 1.5 `cards`
```ts
const CardSchema = new Schema(
  {
    columnId: { type: ObjectId, ref: 'Column', required: true },
    boardId: { type: ObjectId, ref: 'Board', required: true },
    title: { type: String, required: true, maxlength: 500 },
    description: { type: String },
    position: { type: Number, required: true },
    dueDate: { type: Date },
    isCompleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    coverColor: { type: String, match: /^#[0-9A-F]{6}$/i },
    coverAttachmentId: { type: ObjectId, ref: 'Attachment' },
    createdBy: { type: ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

CardSchema.index({ columnId: 1, position: 1 }, { unique: true });
CardSchema.index({ boardId: 1, isArchived: 1, position: 1 });
CardSchema.index({ dueDate: 1, isCompleted: 1 });
CardSchema.index({ createdBy: 1 });
```

> **Ghi chú:** Với MongoDB, chúng ta lưu thẳng `boardId` trong `cards` để hỗ trợ truy vấn nhanh, dù dữ liệu cũng có trong `columns`. Khi đồng bộ, nên sử dụng transaction hoặc `bulkWrite` để đảm bảo nhất quán.

---

## 🏷️ 2. Label System

### 2.1 `labels`
```ts
const LabelSchema = new Schema(
  {
    boardId: { type: ObjectId, ref: 'Board', required: true },
    name: { type: String, required: true, maxlength: 100, trim: true },
    color: { type: String, required: true, match: /^#[0-9A-F]{6}$/i },
  },
  { timestamps: true }
);

LabelSchema.index({ boardId: 1, name: 1 }, { unique: true });
LabelSchema.index({ boardId: 1, color: 1 });
```

### 2.2 `cardLabels`
```ts
const CardLabelSchema = new Schema(
  {
    cardId: { type: ObjectId, ref: 'Card', required: true },
    labelId: { type: ObjectId, ref: 'Label', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

CardLabelSchema.index({ cardId: 1, labelId: 1 }, { unique: true });
CardLabelSchema.index({ labelId: 1 });
```

> Có thể cân nhắc lưu danh sách `labelIds` trực tiếp trong document `cards` nếu số lượng nhãn ít và cần tối ưu truy vấn đọc.

---

## 👥 3. Membership & Permissions

### 3.1 `boardMembers`
```ts
const BoardMemberSchema = new Schema(
  {
    boardId: { type: ObjectId, ref: 'Board', required: true },
    userId: { type: ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'admin', 'member', 'observer'], default: 'member' },
    isStarred: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BoardMemberSchema.index({ boardId: 1, userId: 1 }, { unique: true });
BoardMemberSchema.index({ userId: 1, isStarred: 1 });
BoardMemberSchema.index({ boardId: 1, role: 1 });
```

### 3.2 `cardMembers`
```ts
const CardMemberSchema = new Schema(
  {
    cardId: { type: ObjectId, ref: 'Card', required: true },
    userId: { type: ObjectId, ref: 'User', required: true },
    assignedAt: { type: Date, default: Date.now },
    assignedBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: false }
);

CardMemberSchema.index({ cardId: 1, userId: 1 }, { unique: true });
CardMemberSchema.index({ userId: 1 });
```

### 3.3 `workspaceMembers`
```ts
const WorkspaceMemberSchema = new Schema(
  {
    workspaceId: { type: ObjectId, ref: 'Workspace', required: true },
    userId: { type: ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

WorkspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });
WorkspaceMemberSchema.index({ userId: 1 });
```

> Để tận dụng ưu thế NoSQL, có thể embed danh sách `memberIds` trong board/workspace khi số lượng thành viên nhỏ. Tuy nhiên, schema tách riêng giúp dễ quản lý role và query phức tạp.

---

## ✅ 4. Checklist System

### 4.1 `checklists`
```ts
const ChecklistSchema = new Schema(
  {
    cardId: { type: ObjectId, ref: 'Card', required: true },
    title: { type: String, default: 'Checklist', maxlength: 255 },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ChecklistSchema.index({ cardId: 1, position: 1 });
```

### 4.2 `checklistItems`
```ts
const ChecklistItemSchema = new Schema(
  {
    checklistId: { type: ObjectId, ref: 'Checklist', required: true },
    content: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    position: { type: Number, required: true },
    dueDate: { type: Date },
    assignedTo: { type: ObjectId, ref: 'User' },
    completedAt: { type: Date },
    completedBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ChecklistItemSchema.index({ checklistId: 1, position: 1 }, { unique: true });
ChecklistItemSchema.index({ checklistId: 1, isCompleted: 1 });
```

---

## 💬 5. Comments & Activity

### 5.1 `comments`
```ts
const CommentSchema = new Schema(
  {
    cardId: { type: ObjectId, ref: 'Card', required: true },
    boardId: { type: ObjectId, ref: 'Board', required: true },
    userId: { type: ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
  },
  { timestamps: true }
);

CommentSchema.index({ cardId: 1, createdAt: -1 });
CommentSchema.index({ boardId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1, createdAt: -1 });
```

### 5.2 `activities`
```ts
const ActivitySchema = new Schema(
  {
    boardId: { type: ObjectId, ref: 'Board' },
    cardId: { type: ObjectId, ref: 'Card' },
    userId: { type: ObjectId, ref: 'User', required: true },
    actionType: {
      type: String,
      enum: [
        'create_board', 'update_board', 'archive_board',
        'create_column', 'update_column', 'move_column', 'archive_column',
        'create_card', 'update_card', 'move_card', 'archive_card',
        'add_card_member', 'remove_card_member', 'add_card_label', 'remove_card_label',
        'add_comment', 'update_comment', 'delete_comment',
        'add_attachment', 'delete_attachment',
        'add_checklist', 'update_checklist', 'delete_checklist', 'complete_checklist_item',
        'add_board_member', 'remove_board_member', 'update_member_role'
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['board', 'column', 'card', 'comment', 'attachment', 'checklist', 'checklist_item', 'member', 'label'],
      required: true,
    },
    entityId: { type: ObjectId },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivitySchema.index({ boardId: 1, createdAt: -1 });
ActivitySchema.index({ cardId: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ actionType: 1, createdAt: -1 });
```

---

## 📎 6. Attachments

```ts
const AttachmentSchema = new Schema(
  {
    cardId: { type: ObjectId, ref: 'Card', required: true },
    filename: { type: String, required: true },
    originalFilename: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    fileUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    isCover: { type: Boolean, default: false },
    uploadedBy: { type: ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: 'uploadedAt', updatedAt: false } }
);

AttachmentSchema.index({ cardId: 1 });
AttachmentSchema.index({ uploadedBy: 1, uploadedAt: -1 });
AttachmentSchema.index({ cardId: 1, isCover: 1 });
```

> Các file thực tế nên lưu trong dịch vụ object storage (S3, Cloud Storage...) và chỉ lưu metadata trong MongoDB.

---

## 🔔 7. Notifications

```ts
const NotificationSchema = new Schema(
  {
    userId: { type: ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['card_assigned', 'card_due_soon', 'card_overdue', 'comment_added', 'board_invitation', 'checklist_completed', 'attachment_added'],
      required: true,
    },
    title: { type: String, required: true, maxlength: 255 },
    message: { type: String },
    entityType: { type: String, enum: ['card', 'board', 'comment', 'attachment'] },
    entityId: { type: ObjectId },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });
```

---

## 🎨 8. Custom Fields (Optional)

### 8.1 `customFields`
```ts
const CustomFieldSchema = new Schema(
  {
    boardId: { type: ObjectId, ref: 'Board', required: true },
    name: { type: String, required: true, maxlength: 100 },
    type: { type: String, enum: ['text', 'number', 'date', 'checkbox', 'dropdown'], required: true },
    options: [{ label: String, value: String }],
    isRequired: { type: Boolean, default: false },
    position: { type: Number, required: true },
  },
  { timestamps: true }
);

CustomFieldSchema.index({ boardId: 1, position: 1 }, { unique: true });
```

### 8.2 `cardCustomFields`
```ts
const CardCustomFieldSchema = new Schema(
  {
    cardId: { type: ObjectId, ref: 'Card', required: true },
    customFieldId: { type: ObjectId, ref: 'CustomField', required: true },
    value: Schema.Types.Mixed,
  },
  { timestamps: true }
);

CardCustomFieldSchema.index({ cardId: 1, customFieldId: 1 }, { unique: true });
```

---

## 📊 9. Aggregation Views & Materialized Projections

### 9.1 MongoDB Views
```js
// boardSummary view
use('trello');
db.createView('boardSummary', 'boards', [
  { $match: { isClosed: false } },
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: '_id',
      as: 'creator',
    },
  },
  { $unwind: '$creator' },
  {
    $lookup: {
      from: 'columns',
      localField: '_id',
      foreignField: 'boardId',
      as: 'columns',
    },
  },
  {
    $lookup: {
      from: 'boardMembers',
      localField: '_id',
      foreignField: 'boardId',
      as: 'members',
    },
  },
  {
    $addFields: {
      columnCount: { $size: { $filter: { input: '$columns', as: 'c', cond: { $eq: ['$$c.isArchived', false] } } } },
      cardCount: {
        $sum: {
          $map: {
            input: '$columns',
            as: 'col',
            in: {
              $size: {
                $filter: {
                  input: '$$col.cards',
                  as: 'card',
                  cond: { $eq: ['$$card.isArchived', false] },
                },
              },
            },
          },
        },
      },
      memberCount: { $size: '$members' },
      createdByName: '$creator.fullName',
    },
  },
  {
    $project: {
      creator: 0,
      columns: 0,
      members: 0,
    },
  },
]);
```

### 9.2 Materialized Stats Collection (optional)
- Tạo collection `boardStats` và `userStats` được cập nhật thông qua cron job hoặc change stream để tránh truy vấn aggregation nặng mỗi lần load dashboard.
- Document ví dụ:
```json
{
  "boardId": ObjectId("..."),
  "totalColumns": 4,
  "totalCards": 32,
  "completedCards": 12,
  "overdueCards": 3,
  "totalMembers": 5,
  "totalLabels": 9,
  "updatedAt": ISODate("2025-09-26T10:00:00Z")
}
```

---

## 🔄 10. Position Management Helpers

- Sử dụng `bulkWrite` hoặc transaction để cập nhật `position` khi reorder.
- Ví dụ di chuyển card trong cùng column:
```ts
await Card.bulkWrite([
  {
    updateMany: {
      filter: {
        columnId,
        position: { $gte: newPosition },
        _id: { $ne: cardId },
      },
      update: { $inc: { position: 1 } },
    },
  },
  {
    updateOne: {
      filter: { _id: cardId },
      update: { $set: { columnId, position: newPosition, updatedAt: new Date() } },
    },
  },
]);
```
- Khi di chuyển giữa hai column, sử dụng transaction (MongoDB 4.2+) để đảm bảo đóng gap ở column nguồn và chèn vào column đích.

---

## 🔒 11. Security & Access Control

- Sử dụng **MongoDB Realm Rules** hoặc **app-level ACL** để giới hạn truy cập document theo `userId`.
- Bật **schema validation** cho từng collection để tránh dữ liệu sai định dạng:
```js
db.runCommand({
  collMod: 'boards',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'createdBy'],
      properties: {
        title: { bsonType: 'string', maxLength: 255 },
        createdBy: { bsonType: 'objectId' },
      },
    },
  },
  validationLevel: 'moderate',
});
```
- Áp dụng **change streams** để phát hiện thao tác trái phép, hoặc đồng bộ real-time.

---

## 📈 12. Performance Optimizations

- Index gộp:
  - `cards`: `{ boardId: 1, isArchived: 1, position: 1 }`
  - `boardMembers`: `{ userId: 1, isStarred: 1 }`
  - `activities`: `{ boardId: 1, createdAt: -1 }`
- **Partial index** cho dữ liệu active:
```js
db.cards.createIndex({ updatedAt: -1 }, { partialFilterExpression: { isArchived: false } });
```
- **TTL index** cho thông báo đã đọc lâu ngày (ví dụ 90 ngày):
```js
db.notifications.createIndex(
  { readAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90, partialFilterExpression: { isRead: true } }
);
```
- Dùng `sharding` theo `workspaceId` hoặc `boardId` nếu quy mô lớn.

---

## 🚀 13. Migration & Seed Script (mongosh)

```js
use('trello');

// Người dùng mẫu
const now = new Date();
db.users.insertMany([
  {
    _id: ObjectId(),
    username: 'johndoe',
    email: 'john@example.com',
    passwordHash: bcrypt.hashSync('Password123', 10),
    fullName: 'John Doe',
    initials: 'JD',
    isActive: true,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  },
  // ...
]);

// Workspace, board, column, card... tạo tương tự
// Nhớ giữ consistent ObjectId khi insert vào collection liên quan.
```

---

## 📌 Ghi chú triển khai

- **ODM khuyến nghị:** Mongoose 7+ hoặc Prisma Mongo connector.
- **Transactions:** yêu cầu Replica Set (local replica hoặc MongoDB Atlas).
- **Backups:** sử dụng `mongodump` hoặc `Atlas Backup` kết hợp với chiến lược PITR.
- **Analytics:** có thể đồng bộ sang data warehouse (BigQuery, Snowflake) thông qua change streams hoặc Kafka.

---

> **Kết luận:** Cấu trúc MongoDB trên giữ nguyên domain Trello clone, hỗ trợ tốt cả truy vấn realtime lẫn analytics, đồng thời linh hoạt mở rộng với embedding/denormalization khi cần thiết. Hãy tùy chỉnh thêm dựa trên đặc thù workload (số lượng board, user, yêu cầu realtime, v.v.).
