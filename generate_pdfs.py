from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register Arial Unicode for Chinese support
pdfmetrics.registerFont(TTFont('ArialUnicode', '/Library/Fonts/Arial Unicode.ttf'))

W, H = A4
MARGIN = 2.5 * cm

def base_style(font, size, bold=False, color=colors.black, space_before=0, space_after=6, leading=None):
    return ParagraphStyle(
        name=f'{font}{size}',
        fontName=font,
        fontSize=size,
        textColor=color,
        spaceAfter=space_after,
        spaceBefore=space_before,
        leading=leading or size * 1.5,
    )

# ─── ENGLISH PDF ──────────────────────────────────────────────────────────────

def build_english():
    doc = SimpleDocTemplate(
        '/Users/artem/Claude v 1.0/contract-amendment-letter-EN.pdf',
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN,
        title='Letter of Requested Amendments — Credit Agreement',
        author='Party B',
    )

    H1 = base_style('Helvetica-Bold', 13, space_before=0, space_after=4)
    H2 = base_style('Helvetica-Bold', 10, space_before=14, space_after=3, color=colors.HexColor('#1a1a2e'))
    BODY = base_style('Helvetica', 10, space_after=6, leading=16)
    LABEL = base_style('Helvetica-Bold', 10, space_after=2)
    SMALL = base_style('Helvetica', 9, color=colors.HexColor('#555555'), space_after=4, leading=14)
    META = base_style('Helvetica', 9, space_after=3, leading=14)
    SIGN = base_style('Helvetica', 10, space_before=4, space_after=4, leading=16)

    story = []

    # Header
    story.append(Paragraph('LETTER OF REQUESTED AMENDMENTS', H1))
    story.append(Paragraph('Credit Agreement — Mutual Trade Union Co., Limited', base_style('Helvetica', 11, space_after=10)))
    story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#1a1a2e')))
    story.append(Spacer(1, 10))

    # Meta
    for line in [
        '<b>To:</b> Mutual Trade Union Co., Limited',
        '<b>Attention:</b> Authorized Representative',
        '<b>Address:</b> Room 2601, No.1 Building, Wanda Plaza, Choujiang Street, Yiwu City, Zhejiang Province, China',
        '<b>Date:</b> June 17, 2026',
        '<b>Re:</b> Proposed Amendments to Credit Agreement — Prior to Execution',
    ]:
        story.append(Paragraph(line, META))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#cccccc')))
    story.append(Spacer(1, 10))

    # Opening
    story.append(Paragraph(
        'Dear Sir/Madam,', BODY))
    story.append(Paragraph(
        'We have carefully reviewed the Credit Agreement proposed by Mutual Trade Union Co., Limited and wish to express our genuine interest in establishing a strong, long-term partnership with your company.', BODY))
    story.append(Paragraph(
        'We approach this relationship as a committed and reliable client. Our business operates at scale, with consistent order volumes and a clear commercial roadmap for growth. We fully intend to honor our obligations and to build a relationship that is profitable and stable for both sides.', BODY))
    story.append(Paragraph(
        'It is precisely because we value this partnership that we have invested time in a thorough legal and commercial review of the Agreement. The proposed amendments below are not a challenge to your business or your trust — they are standard protections that any well-managed company operating in international trade would require. We are confident that a partner of your standing will recognize them as such.', BODY))
    story.append(Paragraph(
        'We respectfully request your consideration of the following amendments prior to signing, and we remain fully available to discuss any points at your convenience.', BODY))

    amendments = [
        (
            'Amendment 1 — Section 5.1: Interest Rate on Overdue Amounts',
            'Current language: "...interest at a rate of 1.5% per week (or part thereof)..."',
            'Proposed language: "...interest at a rate of 0.5% per month (or part thereof)..."',
            'The current rate of 1.5% per week equates to approximately 78% per annum — significantly above international trade finance benchmarks. We propose 0.5% per month (6% per annum), which reflects standard market practice and remains a meaningful deterrent against late payment. We have no intention of paying late; this amendment simply ensures the penalty remains proportionate if an exceptional situation arises.',
        ),
        (
            'Amendment 2 — Section 4: Joint Inventory Count & Sell-Through Period',
            'Current language: "...the full purchase price for all remaining unsold inventory...within seven (7) Business Days of the final inventory count confirmed by Party A."',
            'Proposed language: "...within fourteen (14) Business Days of the final inventory count, as jointly confirmed by both Party A and Party B. Prior to the inventory count, Party B shall be granted a sell-through period of thirty (30) calendar days following the written discontinuation notice, during which Party B may continue to sell the relevant inventory. Only inventory remaining unsold at the end of the sell-through period shall be subject to the buyout obligation."',
            'A joint inventory count protects both parties equally and removes any risk of dispute after the fact. A 30-day sell-through window reduces the buyout amount naturally, which is in both parties\' commercial interest.',
        ),
        (
            'Amendment 3 — Section 6: Advance Notice of Chinese New Year Payment Deadline',
            'Current language: "...no later than five (5) Business Days prior to the commencement of the Chinese New Year (Lunar New Year) of each calendar year."',
            'Proposed addition: "Party A shall notify Party B in writing of the specific CNY payment deadline no later than sixty (60) calendar days in advance of such date each year."',
            'The Lunar New Year date shifts annually. A 60-day advance written notification ensures both parties are aligned well in advance and eliminates any risk of an unintentional missed deadline due to calendar uncertainty.',
        ),
        (
            'Amendment 4 — Section 8.2: Payment Period Upon Immediate Termination',
            'Current language: "...all outstanding amounts shall become due and payable within forty-eight (48) hours."',
            'Proposed language: "...all outstanding amounts shall become due and payable within five (5) Business Days."',
            'International wire transfers require internal authorization, banking processing time, and compliance checks — particularly for payments from Europe to China. Forty-eight hours is operationally unworkable. Five business days is the standard commercial term and allows full and proper settlement without dispute.',
        ),
        (
            'Amendment 5 — Section 9.2: Arbitration Venue',
            'Current language: "...administered by CIETAC...The seat of arbitration shall be Yiwu City, Zhejiang Province, China."',
            'Proposed language: "...administered by the Singapore International Arbitration Centre (SIAC)...The seat of arbitration shall be Singapore." (Alternative: ICC arbitration seated in Hong Kong SAR.)',
            'As Party B is registered and operating in Europe, CIETAC arbitration seated in Yiwu creates a significant and disproportionate burden on Party B in the event of any dispute. SIAC is a globally recognized, neutral institution with extensive experience in China-Europe commercial matters and is widely accepted by Chinese companies operating internationally.',
        ),
        (
            'Amendment 6 — New Clause (Section 13): Dispatch Service Level Agreement',
            '',
            'Proposed: "Party A shall process and dispatch all outbound shipments within three (3) Business Days of receiving a written dispatch instruction from Party B. Upon dispatch, Party A shall provide tracking number, carrier name, and estimated transit time within one (1) Business Day. Failure to dispatch within the agreed timeline entitles Party B to a credit note of 1% of the affected shipment value per Business Day of delay, up to 10% of the shipment value."',
            'Dispatch speed is the core deliverable of a fulfillment partner. A clear SLA with a proportionate remedy ensures operational predictability for Party B\'s downstream supply chain and sets a clear, fair standard for both parties.',
        ),
        (
            'Amendment 7 — New Clause (Section 14): Fulfillment Accuracy & Storage Obligations',
            '',
            'Proposed: "Party A shall be responsible for accurate storage, picking, packing, and dispatch. All shipments shall match the SKUs and quantities in the dispatch instruction. Party A shall maintain accurate inventory records and provide reports within two (2) Business Days upon request. Goods shall be stored to prevent damage or loss. In the event of fulfillment errors, Party A shall bear all correction costs or issue a credit note at the original purchase price within five (5) Business Days."',
            'Fulfillment accuracy and proper storage are the fundamental obligations of a logistics partner. This clause formalizes mutual expectations and provides a clear resolution mechanism for errors.',
        ),
        (
            'Amendment 8 — New Clause (Section 15): Liability for Goods in Custody',
            '',
            'Proposed: "Party A shall bear full liability for any loss, theft, or physical damage to goods while in Party A\'s custody, including during receipt, storage, picking, packing, and handover to the carrier. Party A shall maintain adequate warehouse insurance covering the replacement value of Party B\'s inventory at all times. Compensation shall be made at original purchase price within ten (10) Business Days of a verified claim."',
            'Party B\'s inventory represents significant capital at risk while in Party A\'s custody. This clause reflects the standard of care expected of any professional warehousing and logistics operator.',
        ),
        (
            'Amendment 9 — New Clause (Section 16): Accuracy of Shipping Documentation',
            '',
            'Proposed: "Party A shall be responsible for the accuracy and completeness of all shipping documentation, including commercial invoices, packing lists, and export documentation. If inaccurate documentation prepared by Party A results in customs delays, fines, or additional costs incurred by Party B, Party A shall reimburse all documented direct costs within ten (10) Business Days of a written claim."',
            'Shipments from China to Switzerland are subject to customs clearance in multiple jurisdictions. Documentation errors cause costly delays and regulatory exposure. As the party preparing these documents, Party A must be accountable for their accuracy.',
        ),
        (
            'Amendment 10 — Section 5.1: Force Majeure Exception from Penalty Interest',
            'Current language: No exception to penalty interest for Force Majeure circumstances.',
            'Proposed addition to Section 5.1: "No interest or penalties shall accrue during any period in which Party B\'s failure to make payment is directly and demonstrably caused by a Force Majeure event as defined in Section 12.5, provided that Party B notifies Party A in writing within five (5) Business Days of the occurrence."',
            'Section 12.5 acknowledges that Force Majeure events can prevent performance — yet the current Section 5.1 would allow penalty interest to accrue even when payment is impossible due to war, a government-imposed banking restriction, or a declared pandemic. This amendment closes that inconsistency.',
        ),
    ]

    for title, current, proposed, rationale in amendments:
        story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#cccccc')))
        story.append(Spacer(1, 4))
        story.append(Paragraph(title, H2))
        if current:
            story.append(Paragraph(f'<i>Current language:</i> {current}', SMALL))
        story.append(Paragraph(f'<i>Proposed:</i> {proposed}', SMALL))
        story.append(Paragraph(f'<b>Rationale:</b> {rationale}', BODY))

    story.append(Spacer(1, 8))
    story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#1a1a2e')))
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        'We are confident that the above amendments represent a fair and balanced framework that protects both parties and sets a strong foundation for a productive long-term relationship. We have structured each request around international commercial standards, not as an expression of distrust, but as the basis on which serious businesses operate.', BODY))
    story.append(Paragraph(
        'We look forward to receiving your response and to moving forward with the partnership promptly.', BODY))
    story.append(Spacer(1, 10))
    story.append(Paragraph('Yours sincerely,', BODY))
    story.append(Spacer(1, 20))
    for line in [
        '___________________________________',
        'Authorized Representative',
        'Title: ____________________________',
        'Company: __________________________',
        'Date: _____________________________',
        'Company Chop / Seal',
    ]:
        story.append(Paragraph(line, SIGN))

    doc.build(story)
    print('✓ English PDF generated.')


# ─── CHINESE PDF ──────────────────────────────────────────────────────────────

def build_chinese():
    doc = SimpleDocTemplate(
        '/Users/artem/Claude v 1.0/contract-amendment-letter-ZH.pdf',
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN,
        title='合同修订建议函 — 互贸联盟有限公司信用协议',
        author='乙方',
    )

    F = 'ArialUnicode'

    H1 = base_style(F, 13, space_before=0, space_after=4)
    H2 = base_style(F, 10, space_before=14, space_after=3, color=colors.HexColor('#1a1a2e'))
    BODY = base_style(F, 10, space_after=6, leading=17)
    SMALL = base_style(F, 9, color=colors.HexColor('#555555'), space_after=4, leading=15)
    META = base_style(F, 9, space_after=3, leading=14)
    SIGN = base_style(F, 10, space_before=4, space_after=4, leading=16)

    story = []

    story.append(Paragraph('合同修订建议函', H1))
    story.append(Paragraph('互贸联盟有限公司信用协议', base_style(F, 11, space_after=10)))
    story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#1a1a2e')))
    story.append(Spacer(1, 10))

    for line in [
        '致：互贸联盟有限公司',
        '收件人：授权代表',
        '地址：中国浙江省义乌市稠江街道万达广场1号楼2601室',
        '日期：2026年6月17日',
        '事由：签署前信用协议修订建议',
    ]:
        story.append(Paragraph(line, META))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#cccccc')))
    story.append(Spacer(1, 10))

    story.append(Paragraph('尊敬的女士/先生，', BODY))
    story.append(Paragraph(
        '我方已仔细审阅贵公司提供的信用协议，并对与互贸联盟有限公司建立长期战略合作关系抱有真诚的期望。', BODY))
    story.append(Paragraph(
        '我方作为一个稳定、可靠的客户进入此次合作。我方业务规模持续增长，订单量稳定，具有清晰的商业发展规划。我方完全承诺履行自身义务，并致力于与贵方建立对双方均具有长期价值的合作关系。', BODY))
    story.append(Paragraph(
        '正是出于对此次合作的重视，我方对协议进行了认真的法律及商务审查。以下修订建议并非对贵公司业务或信誉的质疑，而是任何规范运营的国际贸易企业所必要的标准保护条款。我方相信，以贵公司的专业水准，必能理解并认同这一立场。', BODY))
    story.append(Paragraph(
        '恳请贵方在签署前审阅以下修订建议，我方随时欢迎就任何条款进行进一步沟通。', BODY))

    amendments_zh = [
        (
            '修订一 — 第5.1条：逾期款项利息',
            '现行表述："……按每周1.5%（或不足一周按一周计）的利率计收利息……"',
            '建议修订为："……按每月0.5%（或不足一月按一月计）的利率计收利息……"',
            '每周1.5%的利率折算年利率约为78%，远超国际贸易融资的通行标准。我方建议调整为每月0.5%（年化6%），既符合市场惯例，亦对逾期付款保持合理约束力。我方无意逾期付款，此修订仅为确保在极少数特殊情况下，违约金保持合理水平。',
        ),
        (
            '修订二 — 第4条：联合库存盘点及销售缓冲期',
            '现行表述："……按甲方确认的最终库存数量，在七（7）个工作日内支付所有剩余未售库存的全额采购价款。"',
            '建议修订为："……按双方共同确认的最终库存数量，在十四（14）个工作日内支付。自乙方书面通知停产之日起，乙方享有三十（30）个日历日的销售缓冲期，仅在缓冲期届满后仍未售出的库存方适用回购义务。"',
            '双方联合盘点可有效防止事后争议，对双方均是保障。30天销售缓冲期有助于自然减少需回购的库存量，符合双方的共同商业利益。',
        ),
        (
            '修订三 — 第6条：农历新年还款截止日提前通知',
            '现行表述："……每个日历年农历新年开始前不晚于五（5）个工作日……"',
            '建议新增："甲方须在每年农历新年前至少六十（60）个日历日，以书面形式向乙方告知当年具体还款截止日期。"',
            '农历新年日期每年有所不同。提前60天书面通知可确保双方提前做好安排，从根本上消除因日期变动导致的无意违约风险。',
        ),
        (
            '修订四 — 第8.2条：即时终止后的付款期限',
            '现行表述："……所有未结款项须在四十八（48）小时内到期应付。"',
            '建议修订为："……所有未结款项须在五（5）个工作日内到期应付。"',
            '国际电汇，尤其是从欧洲汇往中国，需经内部审批、银行处理及合规审查等流程。四十八小时在实际操作中难以实现。五个工作日是国际商业惯例标准，可确保款项得到完整、正确的结算。',
        ),
        (
            '修订五 — 第9.2条：仲裁地',
            '现行表述："……提交中国国际经济贸易仲裁委员会（CIETAC）……仲裁地为中国浙江省义乌市。"',
            '建议修订为："……提交新加坡国际仲裁中心（SIAC）……仲裁地为新加坡。"（替代方案：以香港特别行政区为仲裁地的ICC仲裁。）',
            '乙方在欧洲注册及运营，以义乌为仲裁地的CIETAC仲裁将对乙方造成程序和费用上的不对等负担。新加坡国际仲裁中心是全球公认的中立仲裁机构，在中欧商事仲裁领域经验丰富，被众多在国际市场运营的中国企业所接受。',
        ),
        (
            '修订六 — 新增第13条：发货服务水平协议',
            '',
            '建议新增："甲方须在收到乙方书面发货指令后三（3）个工作日内完成出库发货。发货后一（1）个工作日内提供追踪单号、承运商及预计运输时长。如逾期未发货，乙方有权就受影响批次按每延误一个工作日扣减1%申请信用票据，最高不超过该批次货值的10%。"',
            '发货时效是物流合作伙伴的核心交付标准。明确的服务水平协议及配套的合理补偿机制，既保障了乙方下游供应链的可预期性，也为双方设定了清晰、公平的合作基准。',
        ),
        (
            '修订七 — 新增第14条：履约准确性及仓储义务',
            '',
            '建议新增："甲方须对代乙方持有的所有库存承担准确仓储、拣货、打包及发运的责任。出库须与发货指令的SKU和数量完全一致。甲方须维护准确库存记录，并在两（2）个工作日内应要求提供报告。发生履约错误的，甲方须承担全部纠错费用，或在五（5）个工作日内按原采购价开具信用票据。"',
            '履约准确性及妥善仓储是物流合作伙伴的根本义务。本条款将双方合理预期的标准予以明确，并为偶发错误提供清晰的解决机制。',
        ),
        (
            '修订八 — 新增第15条：在管货物的责任',
            '',
            '建议新增："甲方对货物在其管控期间（含收货、仓储、拣货、打包及移交承运商）发生的任何损失、失窃或损坏承担全部责任。甲方须始终为乙方库存投保足额仓储保险。如发生损失或损坏，甲方须在收到经核实索赔后十（10）个工作日内按原采购价予以赔偿。"',
            '乙方库存在甲方管控期间代表着重大资产风险。本条款体现了任何专业仓储及物流运营商应有的注意义务标准，确保双方利益得到对等保障。',
        ),
        (
            '修订九 — 新增第16条：运输单据准确性',
            '',
            '建议新增："甲方须对其代乙方出具的所有运输单据的准确性和完整性负责，包括商业发票、装箱单及出口文件。如因甲方单据错误导致乙方遭受清关延误、罚款或额外费用，甲方须在收到乙方书面索赔后十（10）个工作日内，对乙方全部有据可查的直接损失予以赔偿。"',
            '从中国至瑞士的货物需经多个司法管辖区的海关清关。单据错误将导致高额的延误损失及合规风险。作为单据的编制方，甲方理应对其准确性承担相应责任。',
        ),
        (
            '修订十 — 第5.1条：不可抗力期间免除罚息',
            '现行表述：对不可抗力情形下的付款义务无任何例外规定。',
            '建议在第5.1条末尾增加："如乙方逾期付款系直接且可证明地由第12.5条所定义的不可抗力事件所致，则在不可抗力期间不计收利息及违约金，但乙方须在五（5）个工作日内以书面形式通知甲方并提供合理证明文件。"',
            '第12.5条认可不可抗力事件可能导致履约障碍，但第5.1条的现行表述将在战争、政府禁令或突发公共卫生事件等情形下，仍对无力付款的乙方继续计收罚息。本修订旨在消除两条款之间的内在矛盾。',
        ),
    ]

    for title, current, proposed, rationale in amendments_zh:
        story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#cccccc')))
        story.append(Spacer(1, 4))
        story.append(Paragraph(title, H2))
        if current:
            story.append(Paragraph(f'现行表述：{current}', SMALL))
        story.append(Paragraph(f'建议修订：{proposed}', SMALL))
        story.append(Paragraph(f'理由：{rationale}', BODY))

    story.append(Spacer(1, 8))
    story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#1a1a2e')))
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        '我方相信，上述修订建议在国际商业惯例框架下公平合理，能够为双方建立长期合作关系奠定坚实基础。每一项修订均以国际商业标准为依据，体现的是负责任经营者应有的规范，而非对贵方的不信任。', BODY))
    story.append(Paragraph(
        '期待收到贵方回复，并尽快推进合作协议的落实。', BODY))
    story.append(Spacer(1, 10))
    story.append(Paragraph('此致', BODY))
    story.append(Spacer(1, 20))
    for line in [
        '___________________________________',
        '授权代表',
        '职务：____________________________',
        '公司：____________________________',
        '日期：____________________________',
        '公司印章',
    ]:
        story.append(Paragraph(line, SIGN))

    doc.build(story)
    print('✓ Chinese PDF generated.')


if __name__ == '__main__':
    build_english()
    build_chinese()
    print('Done.')
