import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Plus, Info, Check } from 'lucide-react';
import './MealEditor.css';
import { type Meal } from '../api/adminClient';

interface MealEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (meal: Meal) => void;
    initialData?: Meal | null;
    categories?: any[]; // Dynamic categories
    onRefreshCategories?: () => void;
}

const DEFAULT_MEAL: Meal = {
    name: '',
    description: '',
    category: '',
    type: 'veg',
    price: 0,
    currency: '₹',
    status: 'draft',
    nutrition: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    portionSize: 'Standard',
    ingredients: [],
    cookingInstructions: '',
    packagingInstructions: '',
    tags: [],
    variants: [],
    // Defaults for Meal Plan specific fields
    duration: 28,
    mealsPerDay: 3,
    originalPrice: 0,
    discountedPrice: 0
};

export const MealEditor: React.FC<MealEditorProps> = ({ isOpen, onClose, onSave, initialData, categories }) => {
    const [formData, setFormData] = useState<Meal>(DEFAULT_MEAL);
    const [newIngredient, setNewIngredient] = useState('');
    const [newTag, setNewTag] = useState('');
    const [newVariant, setNewVariant] = useState({ name: '', price: 0 });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(DEFAULT_MEAL);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (field: keyof Meal, value: any) => {
        setFormData((prev: Meal) => ({ ...prev, [field]: value }));
    };

    const handleNutritionChange = (field: keyof typeof formData.nutrition, value: number) => {
        setFormData((prev: Meal) => ({
            ...prev,
            nutrition: { ...prev.nutrition, [field]: value }
        }));
    };

    const addIngredient = () => {
        if (newIngredient.trim()) {
            setFormData((prev: Meal) => ({ ...prev, ingredients: [...prev.ingredients, newIngredient.trim()] }));
            setNewIngredient('');
        }
    };

    const removeIngredient = (idx: number) => {
        setFormData((prev: Meal) => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== idx)
        }));
    };

    const addTag = () => {
        if (newTag.trim()) {
            setFormData((prev: Meal) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData((prev: Meal) => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
    };

    const addVariant = () => {
        if (newVariant.name) {
            setFormData((prev: Meal) => ({
                ...prev,
                variants: [...(prev.variants || []), { name: newVariant.name, priceAdjustment: newVariant.price }]
            }));
            setNewVariant({ name: '', price: 0 });
        }
    };

    const removeVariant = (idx: number) => {
        setFormData((prev: Meal) => ({
            ...prev,
            variants: (prev.variants || []).filter((_, i) => i !== idx)
        }));
    };

    // const handleAddCategory = async () => {
    //     if (!newCategoryName.trim()) return;
    //     setIsCreatingCategory(true);
    //     try {
    //         const name = newCategoryName.trim();
    //         const created = await adminClient.createCategory({
    //             title: name,
    //             subTitle: `Specialized category for ${name} meal plans`
    //         });
    //         toast.success('Category created!');
    //         setNewCategoryName('');
    //         setIsAddingCategory(false);
    //         if (onRefreshCategories) {
    //             onRefreshCategories();
    //         }
    //         // Auto-select the new category
    //         handleChange('category', created.title);
    //     } catch (error) {
    //         console.error(error);
    //         toast.error('Failed to create category');
    //     } finally {
    //         setIsCreatingCategory(false);
    //     }
    // };

    return (
        <div className="meal-editor-overlay">
            <div className="meal-editor-panel slide-in-right">
                <div className="editor-header">
                    <h2>{initialData ? 'Edit Meal' : 'Add New Meal'}</h2>
                    <div className="actions">
                        <button className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn-primary" onClick={() => onSave(formData)}>
                            <Save size={18} /> Save Meal
                        </button>
                        <button className="btn-close" onClick={onClose}><X size={24} /></button>
                    </div>
                </div>

                <div className="editor-content">
                    {/* Basic Info */}
                    <section className="form-section">
                        <h3><Info size={16} /> Basic Information</h3>
                        <div className="form-row">
                            <div className="form-group flex-2">
                                <label>Meal Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    placeholder="e.g. Classic Chicken Biryani"
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => handleChange('category', e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    {categories && categories.length > 0 ? (
                                        categories.map((cat: any) => (
                                            <option key={cat.id} value={cat.name || cat.title}>
                                                {cat.name || cat.title}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No categories available</option>
                                    )}
                                </select>
                                {(!categories || categories.length === 0) && (
                                    <p className="text-xs text-orange-500 mt-1">
                                        Please create categories from the Categories page first
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                    placeholder="Brief description of the meal..."
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Type</label>
                                <div className="radio-group">
                                    {['veg', 'non-veg', 'vegan', 'keto'].map(type => (
                                        <label key={type} className={`radio-label ${formData.type === type ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="mealType"
                                                checked={formData.type === type}
                                                onChange={() => handleChange('type', type)}
                                            />
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => handleChange('status', e.target.value)}
                                    className={`status-select ${formData.status}`}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tags</label>
                                <div className="tags-input-container">
                                    {(formData.tags || []).map((tag, idx) => (
                                        <span key={idx} className="tag-chip">
                                            {tag} <X size={12} onClick={() => removeTag(tag)} />
                                        </span>
                                    ))}
                                    <div className="input-with-btn">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={e => setNewTag(e.target.value)}
                                            placeholder="Add tag..."
                                            onKeyDown={e => e.key === 'Enter' && addTag()}
                                        />
                                        <button onClick={addTag}><Plus size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Plan Config & Pricing */}
                    <section className="form-section">
                        <h3><Check size={16} /> Plan Configuration & Pricing</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Duration (Days)</label>
                                <input
                                    type="number"
                                    value={formData.duration || 28}
                                    onChange={e => handleChange('duration', Number(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Meals Per Day</label>
                                <input
                                    type="number"
                                    value={formData.mealsPerDay || 3}
                                    onChange={e => handleChange('mealsPerDay', Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Original Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.originalPrice || 0}
                                    onChange={e => handleChange('originalPrice', Number(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Discounted Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => handleChange('price', Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Portion Size</label>
                                <input
                                    type="text"
                                    value={formData.portionSize}
                                    onChange={e => handleChange('portionSize', e.target.value)}
                                    placeholder="e.g. 350g"
                                />
                            </div>
                        </div>
                        <div className="nutrition-grid">
                            <div className="form-group">
                                <label>Calories (kcal)</label>
                                <input
                                    type="number"
                                    value={formData.nutrition.calories}
                                    onChange={e => handleNutritionChange('calories', Number(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Protein (g)</label>
                                <input
                                    type="number"
                                    value={formData.nutrition.protein}
                                    onChange={e => handleNutritionChange('protein', Number(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Carbs (g)</label>
                                <input
                                    type="number"
                                    value={formData.nutrition.carbs}
                                    onChange={e => handleNutritionChange('carbs', Number(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fats (g)</label>
                                <input
                                    type="number"
                                    value={formData.nutrition.fats}
                                    onChange={e => handleNutritionChange('fats', Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Ingredients & Prep */}
                    <section className="form-section">
                        <h3><Upload size={16} /> Preparation Details</h3>
                        <div className="form-group">
                            <label>Ingredients</label>
                            <div className="tags-input-container">
                                {(formData.ingredients || []).map((ing, idx) => (
                                    <span key={idx} className="tag-chip">
                                        {ing} <X size={12} onClick={() => removeIngredient(idx)} />
                                    </span>
                                ))}
                                <div className="input-with-btn">
                                    <input
                                        type="text"
                                        value={newIngredient}
                                        onChange={e => setNewIngredient(e.target.value)}
                                        placeholder="Add ingredient..."
                                        onKeyDown={e => e.key === 'Enter' && addIngredient()}
                                    />
                                    <button onClick={addIngredient}><Plus size={16} /></button>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Cooking Instructions</label>
                            <textarea
                                value={formData.cookingInstructions}
                                onChange={e => handleChange('cookingInstructions', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="form-group">
                            <label>Packaging Instructions</label>
                            <textarea
                                value={formData.packagingInstructions}
                                onChange={e => handleChange('packagingInstructions', e.target.value)}
                                rows={2}
                            />
                        </div>
                    </section>

                    {/* Variants & Options */}
                    <section className="form-section">
                        <h3>Variants & Add-ons</h3>
                        <div className="form-group">
                            <label>Option Variants</label>
                            <div className="variants-list">
                                {(formData.variants || []).map((variant, idx) => (
                                    <div key={idx} className="variant-row">
                                        <span>{variant.name}</span>
                                        <span className="price-tag">
                                            {variant.priceAdjustment >= 0 ? '+' : ''}{formData.currency}{variant.priceAdjustment}
                                        </span>
                                        <button className="remove-btn" onClick={() => removeVariant(idx)}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="add-variant-row">
                                <input
                                    type="text"
                                    placeholder="Variant Name (e.g. Extra Protein)"
                                    value={newVariant.name}
                                    onChange={e => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <input
                                    type="number"
                                    placeholder="Price (+/-)"
                                    className="price-input"
                                    value={newVariant.price}
                                    onChange={e => setNewVariant(prev => ({ ...prev, price: Number(e.target.value) }))}
                                />
                                <button className="btn-add-mini" onClick={addVariant}><Plus size={16} /></button>
                            </div>
                        </div>
                    </section>

                    {/* Image */}
                    <section className="form-section">
                        <h3>Image</h3>
                        <div className="image-upload-area">
                            {formData.image ? (
                                <div className="image-preview">
                                    <img src={formData.image} alt="Preview" />
                                    <button onClick={() => handleChange('image', '')} className="remove-img-btn"><X size={14} /></button>
                                </div>
                            ) : (
                                <div className="upload-placeholder">
                                    <Upload size={24} />
                                    <span>Click to upload or drag and drop</span>
                                    <input
                                        type="text"
                                        placeholder="Or paste URL..."
                                        className="url-input"
                                        onBlur={(e) => handleChange('image', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
