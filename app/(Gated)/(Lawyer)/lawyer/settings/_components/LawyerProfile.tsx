import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Lawyer } from '@/store/types/lawyer.types';
import { LawCategory, LawyerLanguage, Courts, Gender, BarCouncils } from '@/lib/enums';
import { Upload, User, Loader2 } from 'lucide-react';
import { enumToLabel } from '@/lib/utils';
import TagInput from '@/components/ui/tag-input';
import { useDebounce } from '@/hooks/use-debounce';
import { checkUsername, updateAvatar } from '@/store/reducers/userSlice';
import { updateMeLawyer } from '@/store/reducers/lawyerSlice';

const PRACTICE_AREAS = [
    { key: LawCategory.CRIMINAL_LAWS, label: 'Criminal Law', sub: ['Bail', 'Trial', 'Appeal', 'NAB', 'Anti-Terrorism', 'Drugs', 'Juvenile'] },
    { key: LawCategory.CIVIL_LAWS, label: 'Civil Law', sub: ['Property', 'Contracts', 'Torts', 'Injunctions', 'Recovery', 'Partition'] },
    { key: LawCategory.FAMILY_LAWS, label: 'Family Law', sub: ['Divorce', 'Custody', 'Maintenance', 'Guardianship', 'Inheritance', 'Dower'] },
    { key: LawCategory.SERVICE_LAWS, label: 'Service Law', sub: ['Employment', 'Dismissal', 'Promotion', 'Pension', 'Disciplinary Actions'] },
    { key: LawCategory.LABOUR_LAWS, label: 'Labour Law', sub: ['Industrial Disputes', 'Wages', 'Trade Unions', 'Workplace Safety'] },
    { key: LawCategory.POLICE_LAWS, label: 'Police Law', sub: ['Police Conduct', 'Police Orders', 'Police Service', 'Accountability'] },
    { key: LawCategory.COMPANIES_LAWS, label: 'Companies Law', sub: ['Incorporation', 'Mergers', 'Compliance', 'Corporate Governance'] },
    { key: LawCategory.LAND_PROPERTY_LAWS, label: 'Land & Property Law', sub: ['Transfer', 'Lease', 'Tenancy', 'Eviction', 'Land Acquisition'] },
    { key: LawCategory.ISLAMIC_RELIGIOUS_LAWS, label: 'Islamic Religious Law', sub: ['Sharia', 'Fiqh', 'Waqf', 'Inheritance', 'Family Matters'] },
    { key: LawCategory.BANKING_FINANCIAL_LAWS, label: 'Banking & Financial Law', sub: ['Banking', 'Finance', 'Securities', 'Microfinance', 'Islamic Banking'] },
    { key: LawCategory.LAW_OF_EVIDENCE, label: 'Law of Evidence', sub: ['Witness', 'Testimony', 'Documentary Evidence', 'Forensics'] },
    { key: LawCategory.RENT_LAWS, label: 'Rent Laws', sub: ['Eviction', 'Tenancy', 'Rent Control', 'Lease Agreements'] },
    { key: LawCategory.INTERNATIONAL_LAWS, label: 'International Law', sub: ['Diplomacy', 'Treaties', 'Human Rights', 'Trade', 'Extradition'] },
    { key: LawCategory.TENANCY_LAWS, label: 'Tenancy Laws', sub: ['Tenancy Agreements', 'Eviction', 'Landlord Rights', 'Tenant Rights'] },
    { key: LawCategory.LAND_REFORM_LAWS, label: 'Land Reform Laws', sub: ['Land Redistribution', 'Ceiling Laws', 'Agrarian Reform'] },
    { key: LawCategory.MINORITIES_LAWS, label: 'Minorities Laws', sub: ['Minority Rights', 'Religious Freedom', 'Affirmative Action'] },
    { key: LawCategory.EXCISE_TAXATION_LAWS, label: 'Excise & Taxation Laws', sub: ['Tax Assessment', 'Excise Duty', 'Property Tax', 'Appeals'] },
    { key: LawCategory.MILITARY_LAWS, label: 'Military Laws', sub: ['Court Martial', 'Military Justice', 'Service Rules'] },
    { key: LawCategory.HEALTH_MEDICAL_LAWS, label: 'Health & Medical Laws', sub: ['Medical Negligence', 'Healthcare Regulation', 'Bioethics'] },
    { key: LawCategory.MEDIA_LAWS, label: 'Media Laws', sub: ['Defamation', 'Censorship', 'Broadcasting', 'Press Freedom'] },
    { key: LawCategory.ELECTION_LAWS, label: 'Election Laws', sub: ['Election Disputes', 'Electoral Rolls', 'Campaign Finance'] },
    { key: LawCategory.DEPARTMENTAL_LAWS, label: 'Departmental Laws', sub: ['Service Rules', 'Departmental Inquiries', 'Disciplinary Actions'] },
    { key: LawCategory.GENERAL_LAWS, label: 'General Laws', sub: ['Constitutional Law', 'Administrative Law', 'Public Interest Litigation'] },
];
const LANGUAGES = Object.values(LawyerLanguage);
const COURTS = Object.values(Courts);
const EXPERIENCE_CATEGORIES = [
    { label: '<5', value: 3 },
    { label: '5-10', value: 7 },
    { label: '10-15', value: 12 },
    { label: '15+', value: 20 },
];

const LawyerProfile = () => {
    //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user) as Lawyer;

    //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
    const [form, setForm] = useState({
        // Personal
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profilePicture: user?.profilePicture || '',
        gender: user?.gender || Gender.OTHER,
        dob: user?.dob || '',
        cnic: user?.cnic || '',
        city: user?.location?.city || undefined,
        province: user?.location?.province || undefined,
        // Professional
        fullName: user?.fullName || '',
        title: user?.title || '',
        bio: user?.bio || '',
        preLicensedYearsOfExperience: user?.preLicensedYearsOfExperience || 0,
        education: user?.education || '',
        licenseNumber: user?.licenseNumber || '',
        licenseValidity: user?.licenseValidity || '',
        barCouncil: user?.barCouncil || BarCouncils.PunjabBarCouncil,
        barAssociation: user?.barAssociation || '',
        barCouncilEnrollmentDate: user?.barCouncilEnrollmentDate || '',
        // Legal Expertise
        primarySpecialization: user?.primarySpecialization || '',
        specializations: user?.specializations || [],
        jurisdictions: user?.jurisdictions || [],
        certifications: user?.certifications || [],
        languages: user?.languages || [],
        summary: user?.summary || '',
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const debouncedUsername = useDebounce(form.username, 500);

    //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
    useEffect(() => {
        if (debouncedUsername.includes(' ')) {
            setUsernameError('Username cannot contain spaces');
            return;
        }
        setUsernameError(null);
        if (debouncedUsername && debouncedUsername !== user?.username) {
            setUsernameLoading(true);
            dispatch(checkUsername(debouncedUsername)).unwrap().then(res => {
                if (res.data?.exists) {
                    setUsernameError('Username already exists');
                } else {
                    setUsernameError(null);
                }
            }).finally(() => setUsernameLoading(false));
        }
    }, [debouncedUsername, dispatch, user?.username]);

    useEffect(() => {
        setForm({
            firstname: user?.firstname || '',
            lastname: user?.lastname || '',
            username: user?.username || '',
            email: user?.email || '',
            phone: user?.phone || '',
            profilePicture: user?.profilePicture || '',
            gender: user?.gender || Gender.OTHER,
            dob: user?.dob || '',
            cnic: user?.cnic || '',
            city: user?.location?.city || undefined,
            province: user?.location?.province || undefined,
            // Professional
            fullName: user?.fullName || '',
            title: user?.title || '',
            bio: user?.bio || '',
            preLicensedYearsOfExperience: user?.preLicensedYearsOfExperience || 0,
            education: user?.education || '',
            licenseNumber: user?.licenseNumber || '',
            licenseValidity: user?.licenseValidity || '',
            barCouncil: user?.barCouncil || BarCouncils.PunjabBarCouncil,
            barAssociation: user?.barAssociation || '',
            barCouncilEnrollmentDate: user?.barCouncilEnrollmentDate || '',
            // Legal Expertise
            primarySpecialization: user?.primarySpecialization || '',
            specializations: user?.specializations || [],
            jurisdictions: user?.jurisdictions || [],
            certifications: user?.certifications || [],
            languages: user?.languages || [],
            summary: user?.summary || '',
        });
    }, [user]);

    //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
    const setField = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
    const addSecondary = (area: LawCategory) => setForm(f => ({ ...f, specializations: f.specializations.includes(area) ? f.specializations : [...f.specializations, area] }));
    const removeSecondary = (area: LawCategory) => setForm(f => ({ ...f, specializations: f.specializations.filter(a => a !== area) }));
    const toggleJurisdiction = (j: any) => setForm(f => ({ ...f, jurisdictions: f.jurisdictions.includes(j) ? f.jurisdictions.filter(x => x !== j) : [...f.jurisdictions, j] }));
    const toggleLanguage = (l: string) => setForm(f => ({ ...f, languages: f.languages.includes(l) ? f.languages.filter(x => x !== l) : [...f.languages, l] }));
    // const addTag = (tags: string[]) => { if (tags.length > 0) setForm(f => ({ ...f, tags: [...f.tags, ...tags] })); };
    // const toggleSubdomain = (area: string, sub: string) => setForm(f => ({ ...f, subdomains: { ...f.subdomains, [area]: f.subdomains[area]?.includes(sub) ? f.subdomains[area].filter((s: string) => s !== sub) : [...(f.subdomains[area] || []), sub] } }));
    const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setFile(file);
        }
    };
    const handleSubmit = () => {
        // setLoading(true);
        const payload: Partial<Lawyer> = {
            ...form,
            primarySpecialization: form.primarySpecialization as LawCategory,
            location: { city: form.city, province: form.province },
            profilePicture: form.profilePicture,
            licenseValidity: form.licenseValidity ? new Date(form.licenseValidity) : null,
            education: form.education ? (Array.isArray(form.education) ? form.education : [form.education]) : undefined,
            barCouncilEnrollmentDate: form.barCouncilEnrollmentDate
                ? new Date(form.barCouncilEnrollmentDate)
                : undefined,
        };

        console.log(payload);

        dispatch(updateMeLawyer(payload))
            .finally(() => setLoading(false));

        if (!file) return;
        dispatch(updateAvatar(file))
            .then(({ meta, payload }: { meta: any, payload: any }) => {
                if (meta.requestStatus === 'fulfilled') {
                    setForm(pre => ({ ...pre, profilePicture: payload?.user?.profilePicture || '' }));
                }
            });
    };

    //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
    return (
        <Card className="w-full mx-auto my-8 shadow-lg border !border-border bg-background p-0 m-0 ">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-foreground"> <User className="h-6 w-6" /> Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
                {/* Personal Information */}
                <section className='py-0' >
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex flex-col items-center gap-2">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={preview || form.profilePicture || user?.profilePicture || undefined} alt="Profile" />
                                <AvatarFallback className="text-lg">{form.firstname[0]}{form.lastname[0]}</AvatarFallback>
                            </Avatar>
                            <label htmlFor="profile-pic-upload">
                                <input
                                    id="profile-pic-upload"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    className="hidden"
                                    onChange={handlePicChange}
                                />
                                <Button asChild variant="outline" size="sm" className="mt-2">
                                    <span><Upload className="w-4 h-4 mr-1" />Upload Photo</span>
                                </Button>
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                            <div className="space-y-2">
                                <Label htmlFor="firstname">First Name</Label>
                                <Input id="firstname" value={form.firstname} onChange={e => setField('firstname', e.target.value)} placeholder="Enter your first name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input id="lastname" value={form.lastname} onChange={e => setField('lastname', e.target.value)} placeholder="Enter your last name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <Input id="username" value={form.username} onChange={e => setField('username', e.target.value)} placeholder="Enter your username" />
                                    {usernameLoading && <Loader2 className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 animate-spin" />}
                                </div>
                                {usernameError && <p className="text-red-500 text-xs">{usernameError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={form.email} disabled className="pr-10 bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={form.phone}
                                    type="tel"
                                    maxLength={11}
                                    onChange={e => {
                                        const v = e.target.value.replace(/\D/g, '').slice(0, 11);
                                        setField('phone', v);
                                    }}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                {/* <Select value={form.gender} onValueChange={v => setField('gender', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                    <SelectContent>
                                        {GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                    </SelectContent>
                                </Select> */}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" type="date" value={form.dob} max={new Date().toISOString().split('T')[0]} onChange={e => setField('dob', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cnic">CNIC / National ID</Label>
                                <Input id="cnic" value={form.cnic} onChange={e => setField('cnic', e.target.value)} placeholder="Enter your CNIC/National ID" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                {/* <Select value={form.city} onValueChange={v => setField('city', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                                    <SelectContent>
                                        {CITIES.map(c => <SelectItem key={c} value={c}>{enumToLabel(c)}</SelectItem>)}
                                    </SelectContent>
                                </Select> */}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="province">Province</Label>
                                {/* <Select value={form.province} onValueChange={v => setField('province', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
                                    <SelectContent>
                                        {PROVINCES.map(p => <SelectItem key={p} value={p}>{enumToLabel(p)}</SelectItem>)}
                                    </SelectContent>
                                </Select> */}
                            </div>
                        </div>
                    </div>
                </section>
                {/* Professional Information */}
                <section className='py-0' >
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Professional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="title">Professional Title / Tagline</Label>
                            <Input id="title" value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Senior Advocate, Family Law Specialist" />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="bio">Bio / About Me</Label>
                            <Textarea rows={5} id="bio" value={form.bio} onChange={e => setField('bio', e.target.value)} placeholder="Write a short bio..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="preLicensedYearsOfExperience">Years of Experience (Pre-License)</Label>
                            <Input id="preLicensedYearsOfExperience" type="number" min={0} value={form.preLicensedYearsOfExperience} onChange={e => setField('preLicensedYearsOfExperience', Number(e.target.value))} placeholder="e.g. 10" />
                            <div className="flex gap-2 mt-2">
                                {EXPERIENCE_CATEGORIES.map(c => (
                                    <Button key={c.label} size="sm" variant={form.preLicensedYearsOfExperience >= c.value ? 'default' : 'outline'} onClick={() => setField('preLicensedYearsOfExperience', c.value)}>{c.label}</Button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="education">Education Summary</Label>
                            <Input id="education" value={form.education} onChange={e => setField('education', e.target.value)} placeholder="e.g. LLB, Harvard Law School" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="licenseNumber">Bar License Number</Label>
                            <Input id="licenseNumber" value={form.licenseNumber} onChange={e => setField('licenseNumber', e.target.value)} placeholder="Enter your bar license number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="licenseValidity">License Validity Date</Label>
                            <Input
                                id="licenseValidity"
                                type="date"
                                value={form.licenseValidity instanceof Date ? form.licenseValidity.toISOString().slice(0, 10) : (form.licenseValidity || '')}
                                onChange={e => setField('licenseValidity', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="barCouncil">License Issuing Authority</Label>
                            <Input id="barCouncil" value={form.barCouncil} onChange={e => setField('barCouncil', e.target.value)} placeholder="e.g. Punjab Bar Council" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="barAssociation">Bar Association</Label>
                            <Input id="barAssociation" value={form.barAssociation} onChange={e => setField('barAssociation', e.target.value)} placeholder="e.g. Punjab Bar Council" />
                        </div>
                    </div>
                </section>
                {/* Legal Expertise */}
                <section className='py-0' >
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Legal Expertise</h2>
                    {/* Primary Practice Area */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Primary Practice Area <span className="text-red-500">*</span></div>
                        {/* <Select value={form.primarySpecialization} onValueChange={v => setField('primarySpecialization', v)}>
                            <SelectTrigger><SelectValue placeholder="Select primary area" /></SelectTrigger>
                            <SelectContent>
                                {PRACTICE_AREAS.map(a => <SelectItem key={a.key} value={a.key}>{a.label}</SelectItem>)}
                            </SelectContent>
                        </Select> */}
                    </div>
                    {/* Secondary Practice Areas */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Secondary Practice Areas</div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {PRACTICE_AREAS.filter(a => a.key !== form.primarySpecialization).map(a => (
                                <Button key={a.key} size="sm" variant={form.specializations.includes(a.key) ? 'default' : 'outline'} onClick={() => form.specializations.includes(a.key) ? removeSecondary(a.key) : addSecondary(a.key)}>{a.label}</Button>
                            ))}
                        </div>
                    </div>
                    {/* Subdomains */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Subdomains / Topics</div>
                        {[form.primarySpecialization, ...form.specializations].filter(Boolean).map(area => {
                            const pa = PRACTICE_AREAS.find(a => a.key === area);
                            if (!pa) return null;
                            return (
                                <div key={area} className="mb-2">
                                    <div className="font-medium text-sm mb-1">{pa.label}</div>
                                    {/* Subdomains removed from new schema */}
                                </div>
                            );
                        })}
                    </div>
                    {/* Jurisdictions */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Jurisdictions</div>
                        <div className="flex flex-wrap gap-2">
                            {COURTS.map((j) => (
                                <Button
                                    key={j}
                                    size="sm"
                                    variant={form.jurisdictions.includes(j as any) ? 'default' : 'outline'}
                                    onClick={() => toggleJurisdiction(j)}
                                >
                                    {enumToLabel(j)}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {/* Certifications */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Certifications & Special Trainings</div>
                        <TagInput
                            value={form.certifications}
                            onChange={(tags) => setField('certifications', tags)}
                            placeholder="Add certification or link..."
                        />
                    </div>
                    {/* Languages */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Languages Spoken</div>
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map(l => (
                                <Button
                                    key={l}
                                    size="sm"
                                    variant={form.languages.includes(l) ? 'default' : 'outline'}
                                    onClick={() => toggleLanguage(l)}
                                >
                                    {enumToLabel(l)}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {/* Summary */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Expertise Statement / Summary</div>
                        <Textarea value={form.summary} onChange={e => setField('summary', e.target.value)} maxLength={300} placeholder="Describe your unique positioning, approach, or niche (200–300 chars)" />
                    </div>
                    {/* Tags */}
                    <div className="mb-4">
                        {/* Tags removed from new schema */}
                    </div>
                </section>
                {/* Admin Verification Status */}
                <section className="border rounded-lg p-4 bg-muted/30">
                    <div className="font-semibold mb-1">Admin Verification Status: <span className={user?.identityVerified ? 'text-green-600' : user?.identityVerified === false ? 'text-red-600' : 'text-yellow-600'}>{user?.identityVerified ? 'verified' : user?.identityVerified === false ? 'rejected' : 'pending'}</span></div>
                </section>
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading}>
                        Save Profile
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LawyerProfile; 