# 🧹 Cleanup Guide - Organize Project Files

Dự án hiện có nhiều files. Guide này sẽ giúp bạn tổ chức lại project.

---

## 📊 Current Situation

```
Total Files: 1,000+ files
- Source code: 380+ files (keep)
- Documentation: 50+ MD files (many duplicates)
- Old backups: 10+ files (can archive)
- Analysis reports: 15+ files (can archive)
- Old configs: 10+ files (can archive)
```

---

## 🎯 Recommended Cleanup Strategy

### Files to KEEP (Essential)

#### Core Documentation

- ✅ `README.md` (1,617 lines) - Main docs
- ✅ `START_HERE.md` - Entry point
- ✅ `MASTER_INDEX.md` - Navigation
- ✅ `CONTRIBUTING.md` - Contributing guide
- ✅ `SECURITY.md` - Security policy
- ✅ `CHANGELOG.md` - Version history
- ✅ `LICENSE` - MIT License
- ✅ `CODE_OF_CONDUCT.md` - Code of conduct

#### Recent Reports

- ✅ `PROJECT_FINAL_REPORT.md` - Final status
- ✅ `FINAL_DEPLOYMENT_CHECKLIST.md` - Deployment guide
- ✅ `COMPREHENSIVE_PROJECT_SUMMARY.md` - Complete summary
- ✅ `INBOUND_SCHEDULE_IMPLEMENTATION.md` - Schema impl

#### Documentation Folder

- ✅ `docs/*` - All files in docs/ folder (20+ files)

#### Configuration

- ✅ `.env.example`
- ✅ `.prettierrc`
- ✅ `.editorconfig`
- ✅ `.nvmrc`
- ✅ `.dockerignore`
- ✅ `nginx.conf`
- ✅ `Makefile`
- ✅ All `.vscode/*` files

#### Source Code

- ✅ All files in `src/`
- ✅ All files in `backend/src/`
- ✅ All files in `public/`

---

### Files to ARCHIVE (Old/Duplicate)

#### 📁 Old README Files (3 files)

- `README-OLD.md` → Archive
- `README-NEW.md` → Archive  
- `README copy.md` → Archive

#### 📁 Backup Files (5+ files)

- `*-backup.js` → Archive
- `*.backup` → Archive
- `*.bak` → Archive
- `package copy.json` → Archive

#### 📁 Analysis Reports (15+ files)

- `*_ANALYSIS.md` → Archive
- `*_STATUS.md` → Archive
- `*_AUDIT.md` → Archive
- `*_UPDATE.md` → Archive

#### 📁 Old Setup Guides (10+ files)

- `GITHUB_SETUP*.md` → Archive
- `GOOGLE_SHEETS_SETUP.md` → Archive
- `TELEGRAM_*.md` → Archive
- `QUICK_SETUP*.md` → Archive
- `QUICK_START.md` → Archive

#### 📁 Old Config Files

- `PORTS_*.md` → Archive
- `CONFIG_STANDARDIZATION.md` → Archive
- `ports.config*.sh` → Archive

#### 📁 Old Backup Directories

- `backup_layout_*` → Archive/Delete
- `BACKUP-FILE-OLD/` → Archive/Delete

---

## 🚀 How to Cleanup

### Option 1: Automated (Recommended)

```bash
# Step 1: Archive old files (creates ZIP backup)
./scripts/archive-old-files.sh

# Step 2: Review archive
unzip -l archive/archived-files-*.zip

# Step 3: Delete originals (if satisfied with archive)
./scripts/clean-archived-files.sh
```

### Option 2: Manual

```bash
# Create archive directory
mkdir -p archive/manual-cleanup

# Move files to archive
mv README-OLD.md archive/manual-cleanup/
mv README-NEW.md archive/manual-cleanup/
mv *_ANALYSIS.md archive/manual-cleanup/
# ... etc

# Create ZIP
cd archive
zip -r manual-cleanup.zip manual-cleanup/
cd ..

# Delete originals
rm -rf archive/manual-cleanup/
```

---

## 📋 Cleanup Checklist

### Before Cleanup

- [ ] Backup entire project (`make backup` hoặc Git commit)
- [ ] Review list of files to archive
- [ ] Make sure you understand what will be deleted
- [ ] Have latest code committed to Git

### During Cleanup

- [ ] Run `./scripts/archive-old-files.sh`
- [ ] Verify ZIP archive created
- [ ] Check archive size is reasonable
- [ ] Review manifest file

### After Cleanup (Optional)

- [ ] Run `./scripts/clean-archived-files.sh`
- [ ] Verify project still works: `make start`
- [ ] Check documentation links still work
- [ ] Commit cleanup changes

---

## 📁 Recommended File Structure After Cleanup

```
mia-logistics-manager/
├── README.md                    # Main docs ⭐
├── START_HERE.md                # Entry point ⭐
├── MASTER_INDEX.md              # Navigation ⭐
│
├── Documentation/
│   ├── CONTRIBUTING.md
│   ├── SECURITY.md
│   ├── CHANGELOG.md
│   ├── LICENSE
│   ├── CODE_OF_CONDUCT.md
│   ├── PROJECT_FINAL_REPORT.md
│   └── FINAL_DEPLOYMENT_CHECKLIST.md
│
├── docs/                        # Technical docs
│   ├── API.md
│   ├── SWAGGER.yaml
│   ├── FEATURES_DETAIL.md
│   ├── schemas/
│   └── ...
│
├── src/                         # Source code (keep all)
├── backend/                     # Backend (keep all)
├── scripts/                     # Scripts (keep all)
├── .github/                     # GitHub config (keep all)
│
├── Configuration files/
│   ├── .env.example
│   ├── .prettierrc
│   ├── .editorconfig
│   ├── Makefile
│   └── ...
│
└── archive/                     # Archived old files
    └── archived-files-*.zip
```

---

## 🔍 What Gets Archived?

### Category Breakdown

| Category | Files | Why Archive |
|----------|-------|-------------|
| Old READMEs | 3 | Replaced by new README.md |
| Backup files | 5+ | No longer needed |
| Analysis reports | 15+ | Served their purpose |
| Old setup guides | 10+ | Replaced by comprehensive docs |
| Old configs | 5+ | Standardized in new configs |
| Old backup dirs | 2+ | Obsolete |
| **TOTAL** | **40+** | **Keep project clean** |

---

## 💾 Archive Management

### Archive Location

```
archive/
├── archived-files-20251112-*.zip
├── session-20251112-*/
└── MANIFEST.md
```

### Archive Retention

- **Keep for**: 30 days minimum
- **Delete after**: Review and confirm not needed
- **Restore if needed**: Unzip and copy back

### Archive Commands

```bash
# List archives
ls -lh archive/*.zip

# View archive contents
unzip -l archive/archived-files-*.zip

# Extract specific file
unzip archive/archived-files-*.zip "path/to/file.md" -d ./

# Extract all
unzip archive/archived-files-*.zip -d ./restored/
```

---

## 🎯 Benefits of Cleanup

### Before Cleanup

- ⚠️ 1,000+ files total
- ⚠️ 50+ MD files in root
- ⚠️ Confusing duplicates
- ⚠️ Hard to find important files
- ⚠️ Slower IDE performance

### After Cleanup

- ✅ ~960 files (40 less)
- ✅ ~15 MD files in root (essential only)
- ✅ Clear structure
- ✅ Easy navigation
- ✅ Better IDE performance

**Estimated space saved**: 10-50 MB

---

## ⚠️ Safety Measures

### Automatic Backup

Script tự động:

1. **Copy** files to archive (không xóa)
2. **Create ZIP** backup
3. **Generate manifest** file
4. **Keep originals** until you confirm

### Manual Deletion

```bash
# Only deletes after you confirm
./scripts/clean-archived-files.sh
# Asks: "Are you sure?" (type 'yes')
```

### Recovery

```bash
# If something goes wrong
unzip archive/archived-files-*.zip -d ./recovered/
cp recovered/path/to/file.md ./
```

---

## 📝 Alternative: Organize Without Deleting

If you prefer not to delete:

```bash
# Create organized structure
mkdir -p organized/{docs,archive-old,backups}

# Move old files
mv README-OLD.md organized/archive-old/
mv *_ANALYSIS.md organized/archive-old/
mv *-backup.js organized/backups/

# Result: Clean root, files preserved
```

---

## 🎯 Recommended Action

### For Production Projects

**Cleanup Level**: **Moderate**

- Archive old files
- **Keep** archive for 30 days
- Delete after review

### For Active Development

**Cleanup Level**: **Light**

- Just organize into folders
- Don't delete anything yet
- Review monthly

### For Archived Projects

**Cleanup Level**: **Aggressive**

- Archive heavily
- Delete immediately
- Keep only essentials

---

## 🚀 Quick Cleanup (5 minutes)

```bash
# 1. Create archive (safe, doesn't delete)
./scripts/archive-old-files.sh

# 2. Review archive
ls -lh archive/

# 3. Test project still works
make start

# 4. Optional: Delete originals
./scripts/clean-archived-files.sh
```

---

## 📞 Questions?

**Q: Will this break my project?**  
A: No. Scripts create backups first. You confirm before deletion.

**Q: Can I undo if needed?**  
A: Yes. Unzip from archive/ directory.

**Q: Which files should I never delete?**  
A: Anything in `src/`, `backend/src/`, `public/`, `.github/workflows/`

**Q: How much space will I save?**  
A: Approximately 10-50 MB, plus easier navigation.

---

**Recommendation**: Run `./scripts/archive-old-files.sh` to start! 🚀

_Last Updated: November 12, 2025_
