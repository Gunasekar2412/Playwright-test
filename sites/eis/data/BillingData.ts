/**
 * Bank and Branch data for Jamaica EFT/Direct Debit payment methods
 * Includes routing numbers and transit numbers from official bank data
 */

export interface BankBranch {
    code: string;
    name: string;
    transitNumber?: string;
    routingNumber?: string;
}

export interface Bank {
    code: string;
    name: string;
    branches: BankBranch[];
}

/**
 * List of banks available for EFT/Direct Debit in Jamaica
 */
export const jamaicaBanks: Bank[] = [
    {
        code: 'BOJ',
        name: 'Bank of Jamaica',
        branches: [
            { code: 'BOJ-01', name: 'Kingston', transitNumber: '00000', routingNumber: '000009991' }
        ]
    },
    {
        code: 'JM_BNS',
        name: 'Bank Of Nova Scotia',
        branches: [
            { code: 'JM_BNS-01', name: 'CHRISTIANA', transitNumber: '00125', routingNumber: '001250024' },
            { code: 'JM_BNS-02', name: 'SAVANNA-LA-MAR', transitNumber: '00265', routingNumber: '002650021' },
            { code: 'JM_BNS-03', name: 'FALMOUTH', transitNumber: '01305', routingNumber: '013050021' },
            { code: 'JM_BNS-04', name: 'Private Banking', transitNumber: '09225', routingNumber: '092250020' },
            { code: 'JM_BNS-05', name: 'MONTEGO BAY', transitNumber: '10215', routingNumber: '102150023' },
            { code: 'JM_BNS-06', name: 'University OF W.I', transitNumber: '18465', routingNumber: '184650020' },
            { code: 'JM_BNS-07', name: "BROWN'S TOWN", transitNumber: '20115', routingNumber: '201150021' },
            { code: 'JM_BNS-08', name: "St.Ann's Bay", transitNumber: '20255', routingNumber: '202550028' },
            { code: 'JM_BNS-09', name: 'Lucea', transitNumber: '21345', routingNumber: '213450020' },
            { code: 'JM_BNS-10', name: 'Constant Spring Financial Centre', transitNumber: '21725', routingNumber: '217250025' },
            { code: 'JM_BNS-11', name: 'JUNCTION', transitNumber: '22475', routingNumber: '224750026' },
            { code: 'JM_BNS-12', name: 'KING STREET', transitNumber: '30015', routingNumber: '300150029' },
            { code: 'JM_BNS-13', name: 'MAY PEN', transitNumber: '30205', routingNumber: '302050020' },
            { code: 'JM_BNS-14', name: 'SJ Building Society', transitNumber: '36525', routingNumber: '365250029' },
            { code: 'JM_BNS-15', name: 'IRONSHORE', transitNumber: '38745', routingNumber: '387450027' },
            { code: 'JM_BNS-16', name: 'BLACK RIVER', transitNumber: '40105', routingNumber: '401050028' },
            { code: 'JM_BNS-17', name: 'OLD HARBOUR', transitNumber: '41335', routingNumber: '413350020' },
            { code: 'JM_BNS-18', name: 'MANDEVILLE', transitNumber: '50195', routingNumber: '501950028' },
            { code: 'JM_BNS-19', name: 'PORT MARIA', transitNumber: '50245', routingNumber: '502450022' },
            { code: 'JM_BNS-20', name: 'NEW KINGSTON', transitNumber: '50575', routingNumber: '505750020' },
            { code: 'JM_BNS-21', name: 'Scotia Centre', transitNumber: '50765', routingNumber: '507650021' },
            { code: 'JM_BNS-22', name: 'HALF WAY TREE', transitNumber: '60145', routingNumber: '601450020' },
            { code: 'JM_BNS-23', name: 'PREMIER', transitNumber: '61325', routingNumber: '613250027' },
            { code: 'JM_BNS-24', name: 'MORANT BAY', transitNumber: '61655', routingNumber: '616550025' },
            { code: 'JM_BNS-25', name: 'LINSTEAD', transitNumber: '70185', routingNumber: '701850025' },
            { code: 'JM_BNS-26', name: 'PORT ANTONIO', transitNumber: '70235', routingNumber: '702350029' },
            { code: 'JM_BNS-27', name: 'CROSS ROADS', transitNumber: '80135', routingNumber: '801350027' },
            { code: 'JM_BNS-28', name: 'SPANISH TOWN', transitNumber: '80275', routingNumber: '802750024' },
            { code: 'JM_BNS-29', name: 'SANTA CRUZ', transitNumber: '81315', routingNumber: '813150024' },
            { code: 'JM_BNS-30', name: 'OXFORD ROAD', transitNumber: '81505', routingNumber: '815050025' },
            { code: 'JM_BNS-31', name: 'Hagley PK. RD.', transitNumber: '90175', routingNumber: '901750022' },
            { code: 'JM_BNS-32', name: 'OCHO RIOS', transitNumber: '90225', routingNumber: '902250026' },
            { code: 'JM_BNS-33', name: 'LIGUANEA', transitNumber: '90365', routingNumber: '903650023' },
            { code: 'JM_BNS-34', name: 'FAIRVIEW', transitNumber: '90605', routingNumber: '906050028' },
            { code: 'JM_BNS-35', name: 'NEGRIL', transitNumber: '92825', routingNumber: '928250026' },
            { code: 'JM_BNS-36', name: 'PORTMORE', transitNumber: '95505', routingNumber: '955050024' }
        ]
    },
    {
        code: 'CBNA',
        name: 'CitiBank N.A',
        branches: [
            { code: 'CBNA-01', name: 'Kingston', transitNumber: '00001', routingNumber: '000010265' }
        ]
    },
    {
        code: 'FGB',
        name: 'First Global Bank',
        branches: [
            { code: 'FGB-01', name: 'NEW KINGSTON', transitNumber: '99075', routingNumber: '990750758' },
            { code: 'FGB-02', name: 'MONTEGO BAY', transitNumber: '99080', routingNumber: '990800750' },
            { code: 'FGB-03', name: 'MANOR PARK', transitNumber: '99082', routingNumber: '990820756' },
            { code: 'FGB-04', name: 'MANDEVILLE', transitNumber: '99084', routingNumber: '990840752' },
            { code: 'FGB-05', name: 'LIGUANEA', transitNumber: '99085', routingNumber: '990850755' },
            { code: 'FGB-06', name: 'Corporate', transitNumber: '99086' },
            { code: 'FGB-07', name: 'Duke & Harbour', transitNumber: '99089', routingNumber: '990890757' },
            { code: 'FGB-08', name: 'OCHO RIOS', transitNumber: '99094', routingNumber: '990940759' },
            { code: 'FGB-09', name: 'Cross Roads', transitNumber: '99095' },
            { code: 'FGB-10', name: 'Santa Cruz', transitNumber: '99096' },
            { code: 'FGB-11', name: 'Portmore', transitNumber: '99097' },
            { code: 'FGB-12', name: 'Linstead', transitNumber: '99098' },
            { code: 'FGB-13', name: 'Hopewell', transitNumber: '99099' },
            { code: 'FGB-14', name: 'May Pen', transitNumber: '99100' }
        ]
    },
    {
        code: 'JM_FCIB',
        name: 'First Caribbean International Bank',
        branches: [
            { code: 'JM_FCIB-01', name: 'Processing Center', transitNumber: '07406', routingNumber: '07406010' },
            { code: 'JM_FCIB-02', name: 'Commercial Clients Group', transitNumber: '07426', routingNumber: '07426010' },
            { code: 'JM_FCIB-03', name: 'Corporate', transitNumber: '07426', routingNumber: '07426010' },
            { code: 'JM_FCIB-04', name: 'Wealth Management', transitNumber: '09004', routingNumber: '09004010' },
            { code: 'JM_FCIB-05', name: 'Manor Park', transitNumber: '09076', routingNumber: '09076010' },
            { code: 'JM_FCIB-06', name: 'King Street', transitNumber: '09156', routingNumber: '09156010' },
            { code: 'JM_FCIB-07', name: 'Port Antonio', transitNumber: '09516', routingNumber: '09516010' },
            { code: 'JM_FCIB-08', name: 'Ocho Rios', transitNumber: '09526', routingNumber: '09526010' },
            { code: 'JM_FCIB-09', name: 'Half Way Tree', transitNumber: '09536', routingNumber: '09536010' },
            { code: 'JM_FCIB-10', name: 'Fairview', transitNumber: '09546', routingNumber: '09546010' },
            { code: 'JM_FCIB-11', name: 'Montego Bay', transitNumber: '09546', routingNumber: '09546010' },
            { code: 'JM_FCIB-12', name: 'May Pen', transitNumber: '09596', routingNumber: '09596010' },
            { code: 'JM_FCIB-13', name: 'Santa Cruz', transitNumber: '09597', routingNumber: '09597010' },
            { code: 'JM_FCIB-14', name: 'Twin Gates', transitNumber: '09656', routingNumber: '09656010' },
            { code: 'JM_FCIB-15', name: 'New Kingston', transitNumber: '09676', routingNumber: '09676010' },
            { code: 'JM_FCIB-16', name: 'Savanna-la-Mar', transitNumber: '09677', routingNumber: '09677010' },
            { code: 'JM_FCIB-17', name: 'Mandeville', transitNumber: '09746', routingNumber: '09746010' },
            { code: 'JM_FCIB-18', name: 'Portmore', transitNumber: '09747', routingNumber: '09747010' },
            { code: 'JM_FCIB-19', name: 'Liguanea', transitNumber: '09748', routingNumber: '09748010' },
            { code: 'JM_FCIB-20', name: 'Head Office', transitNumber: '09866', routingNumber: '09866010' },
            { code: 'JM_FCIB-21', name: 'SBU', transitNumber: '27502', routingNumber: '27502010' },
            { code: 'JM_FCIB-22', name: 'Duke Street' },
            { code: 'JM_FCIB-23', name: 'New Port West' }
        ]
    },
    {
        code: 'JMMB',
        name: 'JMMB Bank',
        branches: [
            { code: 'JMMB-01', name: 'HEAD OFFICE', transitNumber: '00002', routingNumber: '000020624' },
            { code: 'JMMB-02', name: 'KINGSTON', transitNumber: '00003', routingNumber: '000030627' },
            { code: 'JMMB-03', name: 'MONTEGO BAY', transitNumber: '00004', routingNumber: '000040620' },
            { code: 'JMMB-04', name: 'OCHO RIOS', transitNumber: '00024', routingNumber: '000240624' },
            { code: 'JMMB-05', name: 'HAUGHTON', transitNumber: '00060', routingNumber: '000600620' },
            { code: 'JMMB-06', name: 'PORTMORE', transitNumber: '00061', routingNumber: '000610623' },
            { code: 'JMMB-07', name: 'MANDEVILLE', transitNumber: '00063', routingNumber: '000630629' },
            { code: 'JMMB-08', name: 'Fairview' }
        ]
    },
    {
        code: 'JNB',
        name: 'Jamaica National Bank',
        branches: [
            { code: 'JNB-01', name: 'HEAD OFFICE', transitNumber: '00001', routingNumber: '000010508' },
            { code: 'JNB-02', name: 'INTERNAL PROCESSING CENTRE', transitNumber: '00002', routingNumber: '000020501' },
            { code: 'JNB-03', name: 'CENTRALISED OPERATIONS', transitNumber: '00036', routingNumber: '000360504' },
            { code: 'JNB-04', name: 'Half Way Tree', transitNumber: '00051', routingNumber: '000510503' },
            { code: 'JNB-05', name: 'NEW KINGSTON', transitNumber: '00052', routingNumber: '000520506' },
            { code: 'JNB-06', name: 'DUKE STREET', transitNumber: '00053', routingNumber: '000530509' },
            { code: 'JNB-07', name: 'PAPINE', transitNumber: '00055', routingNumber: '000550505' },
            { code: 'JNB-08', name: 'Spanish Town Road(Tivoli)', transitNumber: '00056', routingNumber: '000560508' },
            { code: 'JNB-09', name: 'BARBICAN', transitNumber: '00057', routingNumber: '000570501' },
            { code: 'JNB-10', name: 'WHITEHOUSE', transitNumber: '00058', routingNumber: '000580504' },
            { code: 'JNB-11', name: 'KNUTSFORD BLVD', transitNumber: '00059', routingNumber: '000590507' },
            { code: 'JNB-12', name: 'OLD HARBOUR', transitNumber: '00060', routingNumber: '000600507' },
            { code: 'JNB-13', name: 'HIGHGATE', transitNumber: '00092', routingNumber: '000920504' },
            { code: 'JNB-14', name: 'HWT TRANSPORT CENTRE', transitNumber: '00093', routingNumber: '000930507' },
            { code: 'JNB-15', name: 'UWI', transitNumber: '00094', routingNumber: '000940500' },
            { code: 'JNB-16', name: 'Michi Super Centre', transitNumber: '00095', routingNumber: '000950503' },
            { code: 'JNB-17', name: 'PORTMORE PINES', transitNumber: '00120', routingNumber: '001200508' },
            { code: 'JNB-18', name: 'SPANISH TOWN', transitNumber: '00121', routingNumber: '001210501' },
            { code: 'JNB-19', name: 'LINSTEAD', transitNumber: '00122', routingNumber: '001220504' },
            { code: 'JNB-20', name: 'Premier' },
            { code: 'JNB-21', name: 'MAY PEN', transitNumber: '00191', routingNumber: '001910500' },
            { code: 'JNB-22', name: 'MANDEVILLE', transitNumber: '00261', routingNumber: '002610508' },
            { code: 'JNB-23', name: 'CHRISTIANA', transitNumber: '00262', routingNumber: '002620501' },
            { code: 'JNB-24', name: 'SANTA CRUZ', transitNumber: '00331', routingNumber: '003310506' },
            { code: 'JNB-25', name: 'JUNCTION', transitNumber: '00332', routingNumber: '003320509' },
            { code: 'JNB-26', name: 'SAVANNA-LA-MAR', transitNumber: '00401', routingNumber: '004010504' },
            { code: 'JNB-27', name: 'FALMOUTH', transitNumber: '00450', routingNumber: '004500506' },
            { code: 'JNB-28', name: 'LUCEA', transitNumber: '00471', routingNumber: '004710503' },
            { code: 'JNB-29', name: 'MONTEGO BAY', transitNumber: '00541', routingNumber: '005410501' },
            { code: 'JNB-30', name: "BROWN'S TOWN", transitNumber: '00681', routingNumber: '006810508' },
            { code: 'JNB-31', name: "St. Ann's Bay", transitNumber: '00682', routingNumber: '006820501' },
            { code: 'JNB-32', name: 'OCHO RIOS', transitNumber: '00683', routingNumber: '006830504' },
            { code: 'JNB-33', name: 'PORT MARIA', transitNumber: '00751', routingNumber: '007510506' },
            { code: 'JNB-34', name: 'ANNOTTO BAY', transitNumber: '00752', routingNumber: '007520509' },
            { code: 'JNB-35', name: 'GAYLE', transitNumber: '00753', routingNumber: '007530502' },
            { code: 'JNB-36', name: 'PORT ANTONIO', transitNumber: '00821', routingNumber: '008210504' },
            { code: 'JNB-37', name: 'MORANT BAY', transitNumber: '00891', routingNumber: '008910503' },
            { code: 'JNB-38', name: 'CATHERINE HALL', transitNumber: '00999', routingNumber: '009990506' }
        ]
    },
    {
        code: 'NCB',
        name: 'National Commercial Bank',
        branches: [
            { code: 'NCB-01', name: 'Operations Centre' },
            { code: 'NCB-02', name: 'Card Centre - Issuing' },
            { code: 'NCB-03', name: 'Human Resources Department' },
            { code: 'NCB-04', name: 'Centralized Foreign Exchange' },
            { code: 'NCB-05', name: 'Card Centre - Acquiring' },
            { code: 'NCB-06', name: 'KING STREET', transitNumber: '00006', routingNumber: '000060778' },
            { code: 'NCB-07', name: 'Network Operations' },
            { code: 'NCB-08', name: 'TRANSFORMATION UNIT', transitNumber: '00008', routingNumber: '000080774' },
            { code: 'NCB-09', name: 'Duke and Barry St.', transitNumber: '00010', routingNumber: '000100777' },
            { code: 'NCB-10', name: 'BOULEVARD SUPER CENTRE', transitNumber: '00013', routingNumber: '000130776' },
            { code: 'NCB-11', name: 'Windward Rd Agency', transitNumber: '00016', routingNumber: '000160775' },
            { code: 'NCB-12', name: 'HAGLEY PARK', transitNumber: '00017', routingNumber: '000170778' },
            { code: 'NCB-13', name: 'STAFF TRAINING CENTRE', transitNumber: '00018', routingNumber: '000180771' },
            { code: 'NCB-14', name: 'HARBOUR VIEW', transitNumber: '00020', routingNumber: '000200774' },
            { code: 'NCB-15', name: 'OXFORD PLACE', transitNumber: '00021', routingNumber: '000210777' },
            { code: 'NCB-16', name: 'CROSS ROADS', transitNumber: '00023', routingNumber: '000230773' },
            { code: 'NCB-17', name: '30 KNUTSFORD BLVD.', transitNumber: '00024', routingNumber: '000240776' },
            { code: 'NCB-18', name: 'YALLAHS', transitNumber: '00025', routingNumber: '000250779' },
            { code: 'NCB-20', name: 'PRIVATE BANKING', transitNumber: '00029', routingNumber: '000290771' },
            { code: 'NCB-21', name: 'HALF WAY TREE', transitNumber: '00030', routingNumber: '000300771' },
            { code: 'NCB-22', name: 'Boulevard Super Centre' },
            { code: 'NCB-23', name: 'Red Hills Road' },
            { code: 'NCB-24', name: 'Manor Park', transitNumber: '00033', routingNumber: '000330770' },
            { code: 'NCB-25', name: '1-7 Knutsford Boulevard', transitNumber: '00035', routingNumber: '000350776' },
            { code: 'NCB-26', name: 'PORTMORE', transitNumber: '00036', routingNumber: '000360779' },
            { code: 'NCB-27', name: "MATILDA'S CORNER", transitNumber: '00037', routingNumber: '000370772' },
            { code: 'NCB-28', name: 'NEWPORT WEST', transitNumber: '00039', routingNumber: '000390778' },
            { code: 'NCB-29', name: 'University', transitNumber: '00040', routingNumber: '000400778' },
            { code: 'NCB-30', name: 'Montego Bay', transitNumber: '00043', routingNumber: '000430777' },
            { code: 'NCB-31', name: 'FALMOUTH', transitNumber: '00044', routingNumber: '000440770' },
            { code: 'NCB-32', name: 'Gloucester & Kent' },
            { code: 'NCB-33', name: 'St. Jago Shopping Centre', transitNumber: '00047', routingNumber: '000470779' },
            { code: 'NCB-34', name: 'Mandeville Plaza', transitNumber: '00049', routingNumber: '000490775' },
            { code: 'NCB-35', name: 'Manchester Rd Agency', transitNumber: '00050', routingNumber: '000500775' },
            { code: 'NCB-36', name: 'LEGAL,AML & CORP. COMP. DIV.' },
            { code: 'NCB-37', name: "ST. ANN'S BAY", transitNumber: '00054', routingNumber: '000540777' },
            { code: 'NCB-38', name: 'Lionel Town Agency', transitNumber: '00055', routingNumber: '000550770' },
            { code: 'NCB-39', name: 'MAY PEN', transitNumber: '00056', routingNumber: '000560773' },
            { code: 'NCB-40', name: 'Chapelton', transitNumber: '00057', routingNumber: '000570776' },
            { code: 'NCB-41', name: 'OCHO RIOS', transitNumber: '00058', routingNumber: '000580779' },
            { code: 'NCB-42', name: 'NEGRIL', transitNumber: '00060', routingNumber: '000600772' },
            { code: 'NCB-43', name: 'Savanna-La-Mar', transitNumber: '00061', routingNumber: '000610775' },
            { code: 'NCB-44', name: 'Grange Hill Agency', transitNumber: '00063', routingNumber: '000630771' },
            { code: 'NCB-45', name: 'MORANT BAY', transitNumber: '00064', routingNumber: '000640774' },
            { code: 'NCB-46', name: 'BLACK RIVER', transitNumber: '00067', routingNumber: '000670773' },
            { code: 'NCB-47', name: 'LINSTEAD', transitNumber: '00068', routingNumber: '000680776' },
            { code: 'NCB-48', name: "BROWN'S TOWN", transitNumber: '00071', routingNumber: '000710772' },
            { code: 'NCB-49', name: 'LUCEA', transitNumber: '00075', routingNumber: '000750774' },
            { code: 'NCB-50', name: 'ANNOTTO BAY', transitNumber: '00078', routingNumber: '000780773' },
            { code: 'NCB-51', name: 'PORT MARIA', transitNumber: '00081', routingNumber: '000810779' },
            { code: 'NCB-52', name: "Spaulding's Agency", transitNumber: '00082', routingNumber: '000820775' },
            { code: 'NCB-53', name: 'CHRISTIANA', transitNumber: '00085', routingNumber: '000850771' },
            { code: 'NCB-54', name: 'OLD HARBOUR', transitNumber: '00087', routingNumber: '000870777' },
            { code: 'NCB-55', name: 'JUNCTION', transitNumber: '00088', routingNumber: '000880770' },
            { code: 'NCB-56', name: 'SANTA CRUZ', transitNumber: '00089', routingNumber: '000890773' },
            { code: 'NCB-57', name: 'Head Office' },
            { code: 'NCB-58', name: 'Banking Operations' },
            { code: 'NCB-59', name: 'Centralised Operations', transitNumber: '00201', routingNumber: '002010771' },
            { code: 'NCB-60', name: 'Specialized Operations', transitNumber: '00202', routingNumber: '002020770' },
            { code: 'NCB-61', name: 'DIRECT BANKING UNIT', transitNumber: '00204', routingNumber: '002040770' },
            { code: 'NCB-62', name: 'NCB Cayman' },
            { code: 'NCB-63', name: 'PORT ANTONIO', transitNumber: '00084', routingNumber: '000840778' },
        ]
    },
    {
        code: 'JM_SBL',
        name: 'Sagicor Bank Limited',
        branches: [
            { code: 'JM_SBL-01', name: 'Duke And Tower Street', transitNumber: '1001', routingNumber: '010010815' },
            { code: 'JM_SBL-02', name: 'HALF WAY TREE', transitNumber: '1002', routingNumber: '010020818' },
            { code: 'JM_SBL-03', name: 'MONTEGO BAY', transitNumber: '1033', routingNumber: '010030811' },
            { code: 'JM_SBL-04', name: 'MANDEVILLE', transitNumber: '1004', routingNumber: '010040814' },
            { code: 'JM_SBL-05', name: 'BLACK RIVER', transitNumber: '1006', routingNumber: '010060810' },
            { code: 'JM_SBL-06', name: 'SAVANNA-LA-MAR', transitNumber: '1008', routingNumber: '010080816' },
            { code: 'JM_SBL-07', name: 'MAY PEN', transitNumber: '1011', routingNumber: '010110812' },
            { code: 'JM_SBL-08', name: 'PORTMORE', transitNumber: '1014', routingNumber: '010140811' },
            { code: 'JM_SBL-09', name: 'OCHO RIOS', transitNumber: '1015', routingNumber: '010150814' },
            { code: 'JM_SBL-10', name: 'Up-Park Camp', transitNumber: '1020', routingNumber: '010200816' },
            { code: 'JM_SBL-11', name: 'Knutsford Boulevard' },
            { code: 'JM_SBL-12', name: 'Hope Road', transitNumber: '1024', routingNumber: '010240818' },
            { code: 'JM_SBL-13', name: 'FAIRVIEW', transitNumber: '1025', routingNumber: '010250811' },
            { code: 'JM_SBL-14', name: 'DOMINICA DRIVE', transitNumber: '1034', routingNumber: '010340815' },
            { code: 'JM_SBL-15', name: 'LIGUANEA', transitNumber: '1050', routingNumber: '010500817' },
            { code: 'JM_SBL-16', name: 'Manor Park' },
            { code: 'JM_SBL-17', name: 'TROPICAL PLAZA', transitNumber: '1063', routingNumber: '010630813' },
            { code: 'JM_SBL-18', name: 'Corporate Banking Centre', transitNumber: '1085', routingNumber: '010850813' }
        ]
    },
    {
        code: 'JM_VMBS',
        name: 'VMBS',
        branches: [
            { code: 'JM_VMBS-01', name: 'Half Way Tree', routingNumber: '000010511' },
            { code: 'JM_VMBS-02', name: 'Spanish Town', routingNumber: '000020514' },
            { code: 'JM_VMBS-03', name: 'May Pen', routingNumber: '000030517' },
            { code: 'JM_VMBS-04', name: 'Liguanea', routingNumber: '000040510' },
            { code: 'JM_VMBS-05', name: 'Montego Bay', routingNumber: '000050513' },
            { code: 'JM_VMBS-06', name: 'Ocho Rios', routingNumber: '000060516' },
            { code: 'JM_VMBS-07', name: 'Mandeville', routingNumber: '000070519' },
            { code: 'JM_VMBS-08', name: 'Falmouth', routingNumber: '000080512' },
            { code: 'JM_VMBS-09', name: 'Linstead', routingNumber: '000090515' },
            { code: 'JM_VMBS-10', name: 'Duke Street', routingNumber: '000100515' },
            { code: 'JM_VMBS-11', name: 'New Kingston', routingNumber: '000110518' },
            { code: 'JM_VMBS-12', name: 'Savanna-la-Mar', routingNumber: '000120511' },
            { code: 'JM_VMBS-13', name: 'Santa Cruz', routingNumber: '000140517' },
            { code: 'JM_VMBS-14', name: 'Portmore Mall', routingNumber: '000150510' },
            { code: 'JM_VMBS-15', name: 'UTECH', routingNumber: '000240514' },
            { code: 'JM_VMBS-16', name: 'Fairview', routingNumber: '000280516' }
        ]
    }
];

/**
 * Helper function to get a bank by code
 * @param bankCode - The bank code (e.g., 'NCB', 'JM_BNS')
 * @returns Bank object or undefined if not found
 */
export function getBankByCode(bankCode: string): Bank | undefined {
    return jamaicaBanks.find(bank => bank.code === bankCode);
}

/**
 * Helper function to get a branch by code
 * @param branchCode - The branch code (e.g., 'NCB-01', 'JM_BNS-20')
 * @returns BankBranch object or undefined if not found
 */
export function getBranchByCode(branchCode: string): BankBranch | undefined {
    for (const bank of jamaicaBanks) {
        const branch = bank.branches.find(b => b.code === branchCode);
        if (branch) {
            return branch;
        }
    }
    return undefined;
}

/**
 * Helper function to get all branches for a specific bank
 * @param bankCode - The bank code (e.g., 'NCB', 'JM_BNS')
 * @returns Array of BankBranch objects or empty array if bank not found
 */
export function getBranchesByBankCode(bankCode: string): BankBranch[] {
    const bank = getBankByCode(bankCode);
    return bank ? bank.branches : [];
}

/**
 * Helper function to get routing number for a branch
 * @param branchCode - The branch code (e.g., 'NCB-01', 'JM_BNS-20')
 * @returns Routing number string or empty string if not found
 */
export function getRoutingNumberByBranchCode(branchCode: string): string {
    const branch = getBranchByCode(branchCode);
    return branch?.routingNumber || '';
}

/**
 * Helper function to get transit number for a branch
 * @param branchCode - The branch code (e.g., 'NCB-01', 'JM_BNS-20')
 * @returns Transit number string or empty string if not found
 */
export function getTransitNumberByBranchCode(branchCode: string): string {
    const branch = getBranchByCode(branchCode);
    return branch?.transitNumber || '';
}

/**
 * Bank Account Types available for EFT/Direct Debit
 */
export const bankAccountTypes = {
    CHECKING: 'Checking',
    SAVINGS: 'Savings'
} as const;

export type BankAccountType = typeof bankAccountTypes[keyof typeof bankAccountTypes];
