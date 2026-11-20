# CYB 305 Week 4: FTK Imager forensic acquisition

I completed this lab for CYB 305 Digital Forensics at NUTM with Dr. Segun Popoola. I used FTK Imager 8.3.0.27 to examine and re-acquire a supplied **synthetic** USB image for case W4-USB001. There is no real suspect, physical USB acquisition, or real-world user data in this exercise.

The supplied source is `Evidence/USB001_Source.dd`. I created and verified a raw (`dd`) image and an E01 image, exported three live files and one deleted entry, and checked the results with SHA-256. The original source and all deliverables are in this repository; the website is in [`docs/`](docs/).

## Tools

- FTK Imager 8.3.0.27
- Windows PowerShell `Get-FileHash` (SHA-256)
- A supplied synthetic image and fixture reference values

## What I did

1. Recorded the source image’s SHA-256 and byte length before opening it.
2. Added the source as an image file in FTK Imager and reviewed the FAT16 filesystem, directory entries, and BUDGET.CSV.
3. Created a full raw (`dd`) image with verification enabled, then independently compared its SHA-256 with the source.
4. Created a full E01 image with verification enabled and checked its container-file SHA-256.
5. Reopened the E01, reviewed BUDGET.CSV, and ran Verify Drive/Image again.
6. Exported the three live files and the deleted entry; checked their lengths and SHA-256 values against the fixture references.
7. Exported a directory listing, retained the acquisition logs, made an output hash manifest, and checked the source hash again.

## Integrity results

The source measured **17,825,792 bytes** (34,816 sectors of 512 bytes). The E01 file is a compressed container, so its file hash is not expected to equal the raw image hash. FTK’s internal E01 verification compared the represented image data using MD5 and SHA-1; the E01’s stored, computed, and report values matched for both algorithms.

| Item | Length (bytes) | SHA-256 |
|---|---:|---|
| Source `USB001_Source.dd` (start and end) | 17,825,792 | `A5172A7A71583D18365618FC5D8285EDED5D27E9B4CA7E8E6D3D3C68E0C1D26F` |
| Raw `USB001.001` | 17,825,792 | `A5172A7A71583D18365618FC5D8285EDED5D27E9B4CA7E8E6D3D3C68E0C1D26F` |
| E01 container `USB001_E01.E01` | 36,629 | `D977C42DF3A8BE68D511B124A9A2800897DD98652AD677858FA83A79EA1F964F` |
| `README.TXT` export | 140 | `BAF56F58798703E9CC36A5CBF1834C3F60D89A73415B7925C82ECD652E6FD0EA` |
| `BUDGET.CSV` export | 67 | `FE89E1116DDBE63D6D8BA53F4670D30AD2933FA55FFFD4033333C854E83B68B0` |
| `NOTES.TXT` export | 87 | `D3AB8D85E877F2D1BB79EEDD2712316C6B45661688000883EE479012217BB00F` |
| Deleted `!RANSFER.TXT` export | 161 | `34222CDDB3F993289AA82C051D123DD978C7A20650B6C337266B5820549D4A00` |

These are the values recorded in the lab files. I re-computed SHA-256 for all 11 entries in `Output/Records/Output_Hashes.csv` and for the source image; every listed value matched.

## Findings

### Established

- The source image’s recorded starting and ending SHA-256 values are identical.
- The raw image has the same SHA-256 as the source. FTK reported 34,816 sectors and no bad blocks.
- FTK’s E01 verification reported matching stored, computed, and report MD5/SHA-1 values, with no bad blocks. The separate SHA-256 above identifies the E01 container file.
- All four exports matched their recorded reference lengths and SHA-256 values.
- The deleted 161-byte directory entry retains text that mentions copying BUDGET.CSV to a USB device.

### Not established

- The recovered note does not prove that a transfer occurred, identify who wrote it, or identify who used a device.
- The authored names, notes, amounts, and timestamps do not establish real events or real people.
- This exercise does not establish anything about a physical USB device or its user.

## Limitations

This exercise starts with an existing image file; it does not acquire a physical device or capture RAM. No hardware write blocker was used. The data and timestamps are synthetic, and there is no real suspect. The E01 output folder is named `Output/EO1` (letter O), as it is in the delivered files and acquisition log.

The report’s Appendix A lists folder names and filled-in records that are not present in the delivered layout. The actual folders are `Output/Report`, `Output/Screenshots`, `Output/Records`, and `Output/Command_Log`; the acquisition and custody forms under root `Records/` are blank templates. The appendix also cites a screenshot rename map that was not supplied. I have left these source files unchanged rather than silently correcting the report.

The figure references in section 3.7 are also out of sequence: they cite Figures 26 and 27 before Figure 24, and do not cite Figure 25 there. Appendix B indexes Figures 25 and 26 in numerical order.

## Re-verify SHA-256

Run these commands from the repository root in PowerShell:

```powershell
Get-FileHash -LiteralPath 'Evidence\USB001_Source.dd' -Algorithm SHA256
Get-FileHash -LiteralPath 'Output\Raw\USB001.001' -Algorithm SHA256
Get-FileHash -LiteralPath 'Output\EO1\USB001_E01.E01' -Algorithm SHA256
Get-ChildItem 'Output\Live_Exports' -File | Get-FileHash -Algorithm SHA256
Get-FileHash -LiteralPath 'Output\Deleted_Export\!RANSFER.TXT' -Algorithm SHA256
```

On macOS or Linux, from the repository root:

```sh
shasum -a 256 Evidence/USB001_Source.dd \
  Output/Raw/USB001.001 \
  Output/EO1/USB001_E01.E01 \
  Output/Live_Exports/README.TXT \
  Output/Live_Exports/BUDGET.CSV \
  Output/Live_Exports/NOTES.TXT \
  'Output/Deleted_Export/!RANSFER.TXT'
```

Compare the output with the integrity table above. These checks cover file bytes; they do not prove custody or attribution.

## Folder map

```text
Evidence/
  Case_Brief.txt
  USB001_Source.dd
Output/
  Command_Log/       Commands and recorded actions
  Deleted_Export/    Export of the deleted synthetic note
  EO1/               Verified E01 image and FTK log
  Live_Exports/      Three exported live files
  Raw/               Verified raw image and FTK log
  Records/           Directory listing, hash manifest, and FTK log copies
  Report/            Original lab report (PDF and DOCX)
  Screenshots/       Original 27 lab screenshots
Records/             Blank acquisition and custody form templates
docs/                Static project showcase
Command_Blocks.txt   Convenience command reference supplied with the lab
```

## Author and license

Evans Emmanuel Davou — 300 Level Cybersecurity, NUTM.

The MIT license in this repository applies to my README and website source written for this project. It does not relicense the supplied evidence, course materials, FTK Imager, or other third-party content.