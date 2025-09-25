# 🗄️ Database Models for Trello Clone

## 📋 **1. Core Entity Models**

### **User Model**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    initials VARCHAR(2) GENERATED ALWAYS AS (
        UPPER(LEFT(full_name, 1) || COALESCE(LEFT(SPLIT_PART(full_name, ' ', 2), 1), ''))
    ) STORED,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active);
```

### **Board Model**
```sql
CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    background_type ENUM('color', 'gradient', 'image') DEFAULT 'gradient',
    background_value TEXT DEFAULT 'linear-gradient(135deg, #026AA7 0%, #4A90C2 50%, #5AAC44 100%)',
    visibility ENUM('private', 'workspace', 'public') DEFAULT 'private',
    is_closed BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_boards_created_by ON boards(created_by);
CREATE INDEX idx_boards_workspace ON boards(workspace_id);
CREATE INDEX idx_boards_visibility ON boards(visibility);
CREATE INDEX idx_boards_active ON boards(is_closed);
```

### **Workspace Model**
```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('personal', 'team', 'enterprise') DEFAULT 'personal',
    visibility ENUM('private', 'public') DEFAULT 'private',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Column Model (Lists)**
```sql
CREATE TABLE columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique position per board
    CONSTRAINT unique_board_position UNIQUE (board_id, position)
);

-- Indexes
CREATE INDEX idx_columns_board ON columns(board_id);
CREATE INDEX idx_columns_position ON columns(board_id, position);
CREATE INDEX idx_columns_active ON columns(is_archived);
```

### **Card Model**
```sql
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    cover_color VARCHAR(7), -- Hex color
    cover_attachment_id UUID REFERENCES attachments(id),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique position per column
    CONSTRAINT unique_column_position UNIQUE (column_id, position)
);

-- Indexes
CREATE INDEX idx_cards_column ON cards(column_id);
CREATE INDEX idx_cards_position ON cards(column_id, position);
CREATE INDEX idx_cards_due_date ON cards(due_date);
CREATE INDEX idx_cards_created_by ON cards(created_by);
CREATE INDEX idx_cards_active ON cards(is_archived);
```

## 🏷️ **2. Label System**

### **Label Model**
```sql
CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL, -- Hex color like #eb5a46
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique label name per board
    CONSTRAINT unique_board_label UNIQUE (board_id, name)
);

-- Indexes
CREATE INDEX idx_labels_board ON labels(board_id);
CREATE INDEX idx_labels_color ON labels(color);
```

### **Card-Label Junction**
```sql
CREATE TABLE card_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate assignments
    CONSTRAINT unique_card_label UNIQUE (card_id, label_id)
);

-- Indexes
CREATE INDEX idx_card_labels_card ON card_labels(card_id);
CREATE INDEX idx_card_labels_label ON card_labels(label_id);
```

## 👥 **3. Membership & Permissions**

### **Board Members**
```sql
CREATE TABLE board_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role ENUM('owner', 'admin', 'member', 'observer') DEFAULT 'member',
    is_starred BOOLEAN DEFAULT false,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate memberships
    CONSTRAINT unique_board_member UNIQUE (board_id, user_id)
);

-- Indexes
CREATE INDEX idx_board_members_board ON board_members(board_id);
CREATE INDEX idx_board_members_user ON board_members(user_id);
CREATE INDEX idx_board_members_role ON board_members(role);
CREATE INDEX idx_board_members_starred ON board_members(is_starred);
```

### **Card Assignments**
```sql
CREATE TABLE card_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    
    -- Prevent duplicate assignments
    CONSTRAINT unique_card_assignment UNIQUE (card_id, user_id)
);

-- Indexes
CREATE INDEX idx_card_members_card ON card_members(card_id);
CREATE INDEX idx_card_members_user ON card_members(user_id);
```

### **Workspace Members**
```sql
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role ENUM('admin', 'member') DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_workspace_member UNIQUE (workspace_id, user_id)
);
```

## ✅ **4. Checklist System**

### **Checklist Model**
```sql
CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Checklist',
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_checklists_card ON checklists(card_id);
```

### **Checklist Items**
```sql
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    position INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES users(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_checklist_position UNIQUE (checklist_id, position)
);

-- Indexes
CREATE INDEX idx_checklist_items_checklist ON checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_position ON checklist_items(checklist_id, position);
CREATE INDEX idx_checklist_items_completed ON checklist_items(is_completed);
```

## 💬 **5. Comments & Activity**

### **Comments Model**
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_card ON comments(card_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_created ON comments(created_at);
```

### **Activity Log**
```sql
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'create_card', 'move_card', 'add_member', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'card', 'board', 'comment', etc.
    entity_id UUID, -- ID of the affected entity
    details JSONB, -- Additional action details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activities_board ON activities(board_id);
CREATE INDEX idx_activities_card ON activities(card_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_created ON activities(created_at);
CREATE INDEX idx_activities_action ON activities(action_type);
```

## 📎 **6. Attachments**

### **Attachments Model**
```sql
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL, -- in bytes
    mime_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_cover BOOLEAN DEFAULT false,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_attachments_card ON attachments(card_id);
CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by);
CREATE INDEX idx_attachments_cover ON attachments(is_cover);
```

## 🔔 **7. Notifications**

### **Notifications Model**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'card_assigned', 'due_soon', 'comment_added'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    entity_type VARCHAR(50), -- 'card', 'board'
    entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

## 🎨 **8. Custom Fields (Optional)**

### **Custom Field Definitions**
```sql
CREATE TABLE custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type ENUM('text', 'number', 'date', 'checkbox', 'dropdown') NOT NULL,
    options JSONB, -- For dropdown options
    is_required BOOLEAN DEFAULT false,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Custom Field Values**
```sql
CREATE TABLE card_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    custom_field_id UUID NOT NULL REFERENCES custom_fields(id) ON DELETE CASCADE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_card_custom_field UNIQUE (card_id, custom_field_id)
);
```

## 📊 **9. Useful Views & Functions**

### **Board Summary View**
```sql
CREATE VIEW board_summary AS
SELECT 
    b.id,
    b.title,
    b.description,
    b.background_value,
    b.visibility,
    b.created_at,
    u.full_name as created_by_name,
    (SELECT COUNT(*) FROM columns WHERE board_id = b.id AND NOT is_archived) as column_count,
    (SELECT COUNT(*) FROM cards c 
     JOIN columns col ON c.column_id = col.id 
     WHERE col.board_id = b.id AND NOT c.is_archived) as card_count,
    (SELECT COUNT(*) FROM board_members WHERE board_id = b.id) as member_count
FROM boards b
JOIN users u ON b.created_by = u.id
WHERE NOT b.is_closed;
```

### **Card with Stats View**
```sql
CREATE VIEW card_stats AS
SELECT 
    c.*,
    col.title as column_title,
    col.board_id,
    (SELECT COUNT(*) FROM card_labels WHERE card_id = c.id) as label_count,
    (SELECT COUNT(*) FROM card_members WHERE card_id = c.id) as member_count,
    (SELECT COUNT(*) FROM attachments WHERE card_id = c.id) as attachment_count,
    (SELECT COUNT(*) FROM comments WHERE card_id = c.id) as comment_count,
    (SELECT COUNT(*) FROM checklist_items ci 
     JOIN checklists ch ON ci.checklist_id = ch.id 
     WHERE ch.card_id = c.id) as total_checklist_items,
    (SELECT COUNT(*) FROM checklist_items ci 
     JOIN checklists ch ON ci.checklist_id = ch.id 
     WHERE ch.card_id = c.id AND ci.is_completed) as completed_checklist_items
FROM cards c
JOIN columns col ON c.column_id = col.id
WHERE NOT c.is_archived;
```

### **Position Management Functions**
```sql
-- Function to reorder cards within a column
CREATE OR REPLACE FUNCTION reorder_cards_in_column(
    column_uuid UUID,
    card_uuid UUID,
    new_position INTEGER
) RETURNS VOID AS $$
BEGIN
    -- Update positions
    UPDATE cards 
    SET position = position + 1 
    WHERE column_id = column_uuid 
    AND position >= new_position
    AND id != card_uuid;
    
    UPDATE cards 
    SET position = new_position,
        updated_at = NOW()
    WHERE id = card_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to move card between columns
CREATE OR REPLACE FUNCTION move_card_to_column(
    card_uuid UUID,
    target_column_uuid UUID,
    new_position INTEGER
) RETURNS VOID AS $$
DECLARE
    source_column_uuid UUID;
    source_position INTEGER;
BEGIN
    -- Get current column and position
    SELECT column_id, position INTO source_column_uuid, source_position
    FROM cards WHERE id = card_uuid;
    
    -- Remove from source column (close gaps)
    UPDATE cards 
    SET position = position - 1 
    WHERE column_id = source_column_uuid 
    AND position > source_position;
    
    -- Make space in target column
    UPDATE cards 
    SET position = position + 1 
    WHERE column_id = target_column_uuid 
    AND position >= new_position;
    
    -- Move the card
    UPDATE cards 
    SET column_id = target_column_uuid,
        position = new_position,
        updated_at = NOW()
    WHERE id = card_uuid;
END;
$$ LANGUAGE plpgsql;
```

## 🔒 **10. Security & Permissions**

### **Row Level Security Examples**
```sql
-- Enable RLS on sensitive tables
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Users can only see boards they're members of
CREATE POLICY board_member_access ON boards
    FOR ALL TO authenticated
    USING (
        id IN (
            SELECT board_id FROM board_members 
            WHERE user_id = auth.uid()
        )
    );

-- Users can only see/edit cards in boards they're members of
CREATE POLICY card_board_member_access ON cards
    FOR ALL TO authenticated
    USING (
        column_id IN (
            SELECT c.id FROM columns c
            JOIN boards b ON c.board_id = b.id
            JOIN board_members bm ON b.id = bm.board_id
            WHERE bm.user_id = auth.uid()
        )
    );
```

## 📈 **11. Performance Optimizations**

### **Indexes for Common Queries**
```sql
-- Composite indexes for frequent lookups
CREATE INDEX idx_cards_column_position ON cards(column_id, position);
CREATE INDEX idx_board_members_user_starred ON board_members(user_id, is_starred);
CREATE INDEX idx_activities_board_created ON activities(board_id, created_at DESC);

-- Partial indexes for active records
CREATE INDEX idx_active_boards ON boards(created_at) WHERE NOT is_closed;
CREATE INDEX idx_active_cards ON cards(updated_at) WHERE NOT is_archived;
```

### **Database Triggers**
```sql
-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_boards_updated_at 
    BEFORE UPDATE ON boards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at 
    BEFORE UPDATE ON cards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 📋 **12. Migration Scripts**

### **Initial Setup**
```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Enums
CREATE TYPE visibility_type AS ENUM ('private', 'workspace', 'public');
CREATE TYPE member_role_type AS ENUM ('owner', 'admin', 'member', 'observer');
CREATE TYPE background_type AS ENUM ('color', 'gradient', 'image');

-- Default labels for new boards
INSERT INTO labels (board_id, name, color) VALUES
(/* board_id */, 'High Priority', '#eb5a46'),
(/* board_id */, 'Medium Priority', '#f2d600'),
(/* board_id */, 'Low Priority', '#61bd4f'),
(/* board_id */, 'Bug', '#ff5630'),
(/* board_id */, 'Feature', '#0079bf'),
(/* board_id */, 'Documentation', '#c377e0');
```

Đây là schema database hoàn chình cho ứng dụng Trello clone của bạn! 🚀